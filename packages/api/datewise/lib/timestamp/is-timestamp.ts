import { DayjsTimestamp } from "#src/timestamp/dayjs-timestamp.js";
import { FutureInfinity } from "#src/timestamp/future-infinity.js";
import { PastInfinity } from "#src/timestamp/past-infinity.js";
import { Timestamp } from "#src/timestamp/timestamp.js";

export function isTimestamp(x: unknown): x is Timestamp {
    return x instanceof DayjsTimestamp
        || x instanceof FutureInfinity 
        || x instanceof PastInfinity
}