import { DayjsPlainDate } from '#src/plain-date/dayjs-plain-date.js';
import { FutureInfinityDate } from '#src/plain-date/future-infinity-date.js';
import { PlainDate } from '#src/plain-date/index.js';
import { PastInfinityDate } from '#src/plain-date/past-infinity-date.js';

export function isPlainDate (x: unknown): x is PlainDate {
    return x instanceof DayjsPlainDate ||
        x instanceof FutureInfinityDate ||
        x instanceof PastInfinityDate
}