import { Drash, CSRFService } from '../../deps.ts';
import { InvalidReqParamsError } from '../error_handler.ts'

const csrf = new CSRFService(); // allows access to `csrf.token`

export class ExampleResource extends Drash.Resource {
  public paths = [
    '/q/:reqParam',
    '/z/:id/:name?/:age?/:city?',
    '/regex/([0-9]$)',
    // Paths that will match regex: /regex/1, /regex/9
    // Paths that won't: /regex/bob, /regex/13
  ];

   // Tell the resource what HTTP methods should have CSRF protection. In this
  // case, we are telling the resource to protect the POST method. This means
  // the POST method will require the CSRF token.
  public services = {
    POST: [csrf],
  };

  public GET(request: Drash.Request, response: Drash.Response): void {
    // Set the token on the response headers
    response.headers.set("X-CSRF-TOKEN", csrf.token);
    // or set it in a cookie like so:
    //
    //     response.setCookie({
    //       name: "X-CSRF-TOKEN",
    //       value: csrf.token,
    //     });


    if(request.queryParam('redir')) { // redirect example
      // test with: http://0.0.0.0:1447/q/32?redir=mudpie
      this.redirect(
        'https://downquark.work',
        response,
        301,
        { "X-DOWNQUARK-HEADER": "dq.work", },
        )
    }

    if(request.queryParam('err')) { // custom error example
      // test with: http://0.0.0.0:1447/q/32?err=jordans
      throw new InvalidReqParamsError();
    }

    const reqparam = request.pathParam("reqParam");
    if (reqparam)  return response.text('> '+reqparam)

    let body = "GOT";
    const id = request.pathParam("id");
    const name = request.pathParam("name");
    const age = request.pathParam("age");
    const city = request.pathParam("city");
    
    if (id) { body += ` | ${id}` }
    if (name) { body += ` | ${name}` }
    if (age) { body += ` | ${age}` }
    if (city) { body += ` | ${city}` }
    
    if(body !== 'GOT') return response.text(body);

    return response.json({ hello: 'GET - with no param \ maybe a regex match though?' });
  }

  public POST(request: Drash.Request, response: Drash.Response): void {
    const token = request.headers.get("X-CSRF-TOKEN");
    // or get the token from the cookie if it is set there
    //
    //     const token = request.getCookie("X-CSRF-TOKEN");

    if (!token) {
      console.log(`CSRF token is not set - this woud error in a real instance`)
    }
    return response.json({ hello: 'POST' });
  }

  public PUT(request: Drash.Request, response: Drash.Response): void {
    return response.json({ hello: 'PUT' });
  }

  public DELETE(request: Drash.Request, response: Drash.Response): void {
    return response.json({ hello: 'DELETE' });
  }
}