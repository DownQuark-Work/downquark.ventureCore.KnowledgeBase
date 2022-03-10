import { unilogger } from '../deps.ts'
import { CSRFService } from '../deps.ts'
import { PaladinService } from '../deps.ts'
import { RateLimiterService } from '../deps.ts'
import { ResponseTimeService } from '../deps.ts'
import { TengineService } from '../deps.ts'

export const srvRateLimit = new RateLimiterService({
  timeframe: 10 * 1000, // 10 seconds
  max_requests: 5, // No more than 5 requests can be made within 10 seconds
})

export const srvResponseTime = new ResponseTimeService()