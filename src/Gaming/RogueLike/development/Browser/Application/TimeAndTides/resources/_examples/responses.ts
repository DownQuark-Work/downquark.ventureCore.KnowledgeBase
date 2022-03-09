import { DrashResponse } from "https://deno.land/x/drash@v2.5.4/src/http/response.ts";
import { Drash } from "../../deps.ts";

export class ResponseResource extends Drash.Resource {
  public paths = ['/respond',];

  public GET(request: Drash.Request, response: Drash.Response): void {
    const resType = request.queryParam("type")
    /**
     * CALLABLE BY VISITING (IN BROWSER)
     * http://0.0.0.0:1447/respond?type=download
     * http://0.0.0.0:1447/respond?type=file
     * http://0.0.0.0:1447/respond?type=html
     * http://0.0.0.0:1447/respond?type=json
     * http://0.0.0.0:1447/respond?type=text
     * http://0.0.0.0:1447/respond?type=xml
     * http://0.0.0.0:1447/respond?type=send
     */

    resType === 'text' && response.setCookie({ name: "qookie", value: "quark" });

    if(resType === 'send') { // set custom headers and content type
      const ts = Deno.readFileSync("./_public/tst.ts");
      const retTS = new TextDecoder("utf-8").decode(ts)
      return response.send<string>("application/typescript", retTS);
    }
    if(resType === 'download') { // handle as one off due to multiple args
      return response.download(
        "./_public/Left Leg.png", // Relative to the current working directory that executed the entrypoint script
        "image/png", // The content type of the file (used to set the Content-Type header on the response)
      );    
    }
    
    const html = Deno.readFileSync("./_public/tst.html");  // or return response.html("<div>Hello, world!</div>");
    const xml = Deno.readFileSync("./_public/tst.xml");  // or return response.xml("<body>Hello, world!</body>");
    const respContent:{[k:string]:any} = {
      file: "./_public/tst.txt", // Relative to the current working directory that executed the entrypoint script
      html,
      json: { hello: "world" },
      text: "cookie 'qookie' was set",
      xml,
    }
    if(resType) {
      const rT = resType as keyof typeof response
      return typeof response[rT] === 'function' ? (response[rT] as CallableFunction)(respContent[resType]) : null
    }
  }

  public DELETE(request: Drash.Request, response: Drash.Response): void {
    // $ curl --request DELETE  http://localhost:1447/respond 
    response.setCookie({ name: "qookie", value: "eaten", });
    response.deleteCookie("qookie");
    return response.text("qookie cookie was set and deleted!");
  }
}