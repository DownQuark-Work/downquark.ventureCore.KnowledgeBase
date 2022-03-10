import { Drash } from '../deps.ts';
import { CSRFService } from '../deps.ts'

const csrf = new CSRFService(); // allows access to `csrf.token`

export default class LandingResource extends Drash.Resource {
  public paths = [
    '/',
  ];

  public services = {
    POST: [csrf],
  };

  public GET(request: Drash.Request, response: Drash.Response): void {
    response.headers.set("X-CSRF-TOKEN", csrf.token);
    // or set it in a cookie like so:
    //     response.setCookie({ name: "X-CSRF-TOKEN", value: csrf.token, });
    const templateVariables = {
      user: {
        name: "🤓",
        details: {
          "Role": "Software Engineer",
          "Phone": "(555) 555-5555",
          "E-mail": "bat@example.com",
        },
      },
    };

    const html = response.render("/index.html", templateVariables) as string;

    response.html(html);
  }
    // return response.json({ hello: 'GET - with no param \ maybe a regex match though?' });
  // }

  public POST(request: Drash.Request, response: Drash.Response): void {
    const token = request.headers.get("X-CSRF-TOKEN");
    // or get the token from the cookie if it is set there
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