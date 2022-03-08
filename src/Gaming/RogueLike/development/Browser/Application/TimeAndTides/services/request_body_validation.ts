import { Drash } from '../deps.ts'

import { InvalidPOSTReqParamsError } from '../resources/error_handler.ts'

// Create your service that handles request body validation on POST requests
export class RequestBodyValidationService extends Drash.Service {
  // running this servic gets applied to _every_ post request
  // - disabling the throw for now
  public runBeforeResource(
    request: Drash.Request,
    response: Drash.Response,
  ): void {
    if (
      request.method === "POST" &&
      !request.bodyParam("params")
    ) {
      // throw new InvalidPOSTReqParamsError("Body field `params` is required.");
    }
  }
}