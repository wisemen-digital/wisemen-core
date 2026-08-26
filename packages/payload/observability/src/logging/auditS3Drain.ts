import { gzipSync } from 'node:zlib'

import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type {
  DrainContext,
  DrainFn,
} from 'evlog'
import { auditOnly } from 'evlog'
import type { DrainPipelineOptions } from 'evlog/pipeline'
import { createDrainPipeline } from 'evlog/pipeline'

const HOUR_MS = 60 * 60 * 1000

export interface S3AuditDrainOptions {
  bucket: string
  client?: S3Client
  endpoint?: string
  environment: string
  forcePathStyle?: boolean
  /**
   * Safety ceiling for one S3 object. Reaching it creates another object
   * before the hour ends instead of dropping audit events.
   * @default 100,000
   */
  maxBatchSize?: number
  /** Stable workload identifier, e.g. Kubernetes `HOSTNAME`. */
  podName?: string
  /** Prefix below the bucket. The default is `audit`. */
  prefix?: string
  region?: string
  retry?: DrainPipelineOptions<DrainContext>['retry']
  service: string
}

export interface S3AuditDrain extends DrainFn {
  flush: () => Promise<void>
  readonly pending: number
}

/**
 * Buffer audit events in memory and upload one gzipped NDJSON object per pod
 * per hour. A unique key prevents concurrent pods (and restarts) from ever
 * writing the same S3 object.
 */
export function createS3AuditDrain(options: S3AuditDrainOptions): S3AuditDrain {
  const client = options.client ?? new S3Client({
    endpoint: options.endpoint,
    forcePathStyle: options.forcePathStyle,
    region: options.region ?? 'us-east-1',
  })
  const podName = sanitizeKeySegment(options.podName ?? process.env.HOSTNAME ?? 'unknown')
  const prefix = options.prefix?.replace(/^\/+|\/+$/g, '') || 'audit'
  const pipeline = createDrainPipeline<DrainContext>({
    batch: {
      intervalMs: HOUR_MS,
      size: options.maxBatchSize ?? 100_000,
    },
    maxBufferSize: options.maxBatchSize ?? 100_000,
    retry: options.retry ?? {
      maxAttempts: 5,
      maxDelayMs: 60_000,
    },
    onDropped: (events, error) => {
      console.error('[audit-s3] Dropped audit events after upload retries were exhausted.', {
        error,
        eventCount: events.length,
      })
    },
  })(async (events) => {
    const now = new Date()
    const key = buildS3Key({
      date: now,
      environment: options.environment,
      podName,
      prefix,
      service: options.service,
    })
    const body = gzipSync(`${events.map((event) => JSON.stringify(event)).join('\n')}\n`)

    await client.send(new PutObjectCommand({
      Body: body,
      Bucket: options.bucket,
      ContentEncoding: 'gzip',
      ContentType: 'application/x-ndjson',
      Key: key,
    }))
  })

  const drain = auditOnly(pipeline)

  return Object.defineProperties(drain, {
    flush: {
      value: pipeline.flush,
    },
    pending: {
      get: () => pipeline.pending,
    },
  }) as S3AuditDrain
}

interface S3KeyOptions {
  date: Date
  environment: string
  podName: string
  prefix: string
  service: string
}

function buildS3Key({
  date,
  environment,
  podName,
  prefix,
  service,
}: S3KeyOptions): string {
  const hour = date.toISOString().slice(0, 13)

  return [
    prefix,
    `service=${sanitizeKeySegment(service)}`,
    `environment=${sanitizeKeySegment(environment)}`,
    `date=${hour.slice(0, 10)}`,
    `hour=${hour.slice(11, 13)}`,
    `pod=${podName}`,
    `batch=${crypto.randomUUID()}.ndjson.gz`,
  ].join('/')
}

function sanitizeKeySegment(value: string): string {
  return value.replace(/[^\w.=-]/g, '_')
}
