import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
type Duration =
  | `${number} ms`
  | `${number} s`
  | `${number} m`
  | `${number} h`
  | `${number} d`
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`;

export const rateLimiter = ({
  amount,
  time,
}: {
  amount: number;
  time: Duration;
}): Ratelimit => {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(amount, time),
    analytics: true,
  });
  return ratelimit;
};
