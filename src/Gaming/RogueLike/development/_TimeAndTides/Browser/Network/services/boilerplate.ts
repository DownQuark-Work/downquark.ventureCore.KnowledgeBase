import { Drash } from '../deps.ts'
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

export const srvTengine = new TengineService({
  views_path: "../Application",
});

export class LoggingService extends Drash.Service {

  dt = new Date()
  // consoleLogger = new unilogger.ConsoleLogger({});
  fileLogger = new unilogger.FileLogger({
    file: `./_assets/_logs/${this.dt.getFullYear()}${this.dt.getMonth()+1}.${this.dt.getDate()}.log`,
    tag_string: "[ {name} | {env} ] ",
    tag_string_fns: {
      name() {
        return "T&T";
      },
      env() {
        return "LOCAL";
      },
    },
    level: "info"
  });

  reqTmp = {};
  public runBeforeResource(
    request: Drash.Request,
    response: Drash.Response,
  ): void {
    // console.log('requestBEFORE', request)
    // console.log('responseBEFORE', response)
    this.reqTmp = { ...request }
  }

  // Run this service after the resource's HTTP method.
  public runAfterResource(
    request: Drash.Request,
    response: Drash.Response,
  ): void {
    // console.log('requestAFTER', request)
    // console.log('responseAFTER', response)
    if (response.status !== 200)
    {
      this.fileLogger.warn(JSON.stringify(this.reqTmp)) // log out what the user was doing when it broke
      this.fileLogger.error(JSON.stringify(response))
    }
    this.fileLogger.info(response.status +'  | ' + JSON.stringify(request.url))
  }
}