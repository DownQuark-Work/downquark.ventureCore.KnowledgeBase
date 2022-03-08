import { Drash } from '../deps.ts';

export default class LandingResource extends Drash.Resource {
  public paths = [
    '/',
    '/q/:reqParam',
    '/z/:id/:name?/:age?/:city?',
    '/regex/([0-9]$)',
    // Paths that will match regex: /regex/1, /regex/9
    // Paths that won't: /regex/bob, /regex/13
  ];

  public GET(request: Drash.Request, response: Drash.Response): void {


    if(request.queryParam('redir')) {
      // test with: http://0.0.0.0:1447/q/32?redir=mudpie
      this.redirect("https://downquark.work", response, 301)
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
    return response.json({ hello: 'POST' });
  }

  public PUT(request: Drash.Request, response: Drash.Response): void {
    return response.json({ hello: 'PUT' });
  }

  public DELETE(request: Drash.Request, response: Drash.Response): void {
    return response.json({ hello: 'DELETE' });
  }
}