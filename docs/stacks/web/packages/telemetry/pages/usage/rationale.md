# Rationale

`@wisemen/vue-core-telemetry` is a high-level frontend telemetry package. Its job is not to expose every OpenTelemetry primitive directly. Its job is to make sure every Vue application starts from the same baseline implementation.

## Why this package exists

Without a shared package, frontend telemetry usually drifts:

- one app traces requests but not user actions
- one app logs errors but does not attach build metadata
- one app captures Vue errors but another forgets browser promise rejections
- one app sets user context while another does not

This package removes that drift by giving applications one default setup.

## What `telemetry.init(app)` does

`telemetry.init(app)` is the canonical bootstrap step. It is responsible for:

- registering the default Fetch and User Interaction instrumentations once
- initializing the OTEL trace exporter when `traceEndpoint` is configured
- initializing the OTEL metric exporter when `metricsEndpoint` is configured
- initializing the OTEL log exporter when `logEndpoint` is configured
- wiring Vue runtime error capture
- wiring browser `error` and `unhandledrejection` capture

This is why the package keeps the default path opinionated: consumers should not need to remember multiple setup calls to get the baseline behavior.

## Why tracing is included

Tracing answers questions such as:

- which user action triggered a slow request
- which backend dependency caused a workflow to fail
- which build or environment a frontend span came from

The package attaches service and deployment metadata so traces can be filtered by environment, build number, commit hash, or version.

## Why logging is included

Frontend teams often need operational messages that are not represented well as spans alone. OTEL logs are useful for:

- workflow milestones such as “checkout started”
- warnings that are important but not fatal
- error events that should remain searchable even when there is no useful active span

That is why `logEndpoint` exists separately from `traceEndpoint`.

## Why metrics are included

Metrics answer a different class of questions than traces and logs. They are useful for:

- counters such as failed checkouts or retried saves
- histograms such as frontend workflow duration
- gauges or observable measurements produced by browser integrations

That is why `metricsEndpoint` exists separately: some applications need metrics aggregation even when they do not need OTEL logs.

The package initializes the global meter provider, because that is the part every consumer should do the same way. Actual metric values still come from application code or instrumentations that create counters, histograms, and other OTEL instruments.

## Why errors are recorded on both traces and logs

An exception usually matters in two ways:

- it should mark the current span as failed
- it should remain queryable as a log/event

`recordException()` does both when logging is configured. This gives trace correlation and log searchability at the same time.

## Why user and shared attributes matter

Telemetry without context is hard to use. The package supports `setAttribute()`, `setAttributes()`, and `setUser()` so later logs and exceptions can carry:

- tenant or organization identifiers
- locale or feature-flag information
- authenticated user identity
- product-plan or workflow context

This is especially important in frontend systems where many users share the same deployed build.

## Why there is still a `registerAppInstrumentations()` export

The default instrumentations are registered automatically in `init()`. The exported helper remains for advanced cases where an application wants to add more instrumentations beyond the default package behavior.

Use the helper when you explicitly need extra library instrumentation. Do not use it for the normal setup path.
