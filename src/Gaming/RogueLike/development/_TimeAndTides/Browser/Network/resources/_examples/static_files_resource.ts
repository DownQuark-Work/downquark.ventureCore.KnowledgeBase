// http://0.0.0.0:1447/_assets/tree.jpg
import { Drash } from '../../deps.ts';

export class StaticFilesResource extends Drash.Resource {
  
  paths = ["/_assets/.*\.(jpg|png|svg|css|js)"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;

    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}
