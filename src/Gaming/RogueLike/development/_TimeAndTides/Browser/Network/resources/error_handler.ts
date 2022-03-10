// https://drash.land/drash/v2.x/tutorials/servers/error-handling#verification
// verify it works:
// `$ curl http://localhost:1447` -  success
// `$ curl http://localhost:1447/hello` - "Not Found"
import { Drash } from '../deps.ts';


// Create your custom error. This MUST be an extension of Error.
////  --> Error will be thrown from ./landing.ts
// Trigger error by navigating to:
// - http://0.0.0.0:1447/q/32?err=jordans
export class InvalidReqParamsError extends Error {
  // It is a good idea to associate the HTTP status code in your custom error
  // so you can retrieve it as `error.code` in your error handler class
  public code = 400;

  constructor(message?: string) {
    // Use the message provided or default to a generic error message
    super(message ?? "Invalid request params received.");
  }
}

// Trigger with:
// `$ curl -X POST -v http://localhost:1447/home`
// Valid one for sanity:
// `$ curl -X POST -v -H "Content-Type: application/json" -d '{"params":"hello"}' localhost:1447/home`
export class InvalidPOSTReqParamsError extends Error {
  public code = 400;
  constructor(message?: string) {
    super(message ?? "Invalid request params received in SERVICE on POST");
  }
}

// Create your error handler to send JSON responses instead of Drash sending
// an error with a stack trace

export class DqErrorHandler extends Drash.ErrorHandler {
  public catch(
    error: Error,
    request: Request,
    response: Drash.Response,
  ): void {
    // Default to 500
    let code = 500;
    let message = "Server failed to process the request. Please try again later.";
    
    // Handle all built-in Drash errors. This means any error that Drash
    // throws internally will be handled in this block. This also means any
    // resource that throws Drash.Errors.HttpError will be handled here.
    if (error instanceof Drash.Errors.HttpError) {
      response.status = error.code;
      return response.json({
        message: error.message,
      });
    }

    // If this was a bad request, then return 400
    console.log('error', error)
    if (error instanceof InvalidReqParamsError){
      code = 400;
      message = "Invalid request params/body received.";
    }

    // If the error is not of type Drash.Errors.HttpError, then default to a
    // HTTP 500 error response. This is useful if you cannot ensure that
    // third-party dependencies (e.g., some database dependency) will throw
    // an error object that can be converted to an HTTP response.
    response.status = 500;
    return response.json({
      message
    });
  }
}



/*
class ErrorHandler extends Drash.ErrorHandler {
  public catch(error: Error, _request: Drash.Request, response: Drash.Response) {
    // Default to 500
    let code = 500;
    let message = "Server failed to process the request. Please try again later.";

    // If this was a bad request, then return 400
    if (error instanceof BadRequestError) {
      code = 400;
      message = "Invalid request params/body received.";
    }

    // If this was an unauthorized request, then return 401
    if (error instanceof UnauthorizedError) {
      code = 401;
      message = "You cannot access this resource.";
    }

    // If an internal Drash error was thrown, use the status code and message
    // attached to the error object
    if (error instanceof Drash.Errors.HttpError) {
      code = error.code;
      message = error.message;
    }

    // ... and so on ...

    // Return the response for Drash to send to the client
    response.status = code;
    return response.json({
      message,
    });

    // The above will result in the following response ...
    //
    //   {
    //     message: "Whatever the message variable was set to.",
    //   }
    //
    // ... and will have the correct status code in the Status Line of the
    // response
  }
}

*/