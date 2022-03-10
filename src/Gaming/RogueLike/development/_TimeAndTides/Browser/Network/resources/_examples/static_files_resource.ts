
import { Drash } from '../../deps.ts';

export class StaticFilesResource extends Drash.Resource {
  // This resource will handle the following paths:
  //
  //   1. /favicon.ico
  //   2. /_public/<anything>.<extension>
  //
  // With the power of URLPattern, which is what Drash uses internally
  // to create paths based on a resources paths, you can use regex to
  // define your own paths.
  //
  // Here, your resource will be able to handle requests like:
  //
  // /_public/js/app.js
  // /_public/app.js
  // /_public/css/one/two/three/app.css
  // /_public/images/users/52/profile_picture.png
  // /_public/images/logos/logo.svg
  //
  // Due to the regex below: "/_public/.*\.(jpg|png|svg|css|js)"
  //
  //   .* - This means it will match anything, such as /_public/hello, /_public/very/deep/path
  //   \. - A literal ".", because as this is a files resource, the request url should have an extension: ".css"
  //   (jpg|png|svg|css|js) - Following the ".", the path should end in ONE of these values
  // paths = ["/favicon.ico", "/_public/.*\.(jpg|png|svg|css|js)"];
  paths = ["/_public/.*\.(jpg|png|svg|css|js)"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;
    // The path will now be something that matches the `paths` property,
    // for example: "/favicon.ico"

    // With any request, we need to set a response, so what we will do is
    // find the file using the path, with Drash's `file()` method.
    // For more information on this method, see https://drash.land/drash/v2.x/tutorials/responses/setting-the-body#file,
    // but it will read the content of the parameter passed in, and set that as the body
    //
    // Be aware that this can be insecure if you haven't limited your `paths` property, for example,
    // say you have confidential images in `./private`, and your path looks like `paths = [..., "/private/\."],
    // a user CAN make a request to `https://.../private/my_invoice_2021.pdf

    // view with: 
    // - http://0.0.0.0:1447/_public/tree.jpg
    // must be run with: `--allow-read`:
    // - deno run --allow-net --allow-read app.ts
    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}

/** MORE DOCUMENTATION
 * And there you have it! You can now handle any file you want and the options are limitless:

You can make your files resource only handle /favicon.ico if you do not use any other assets in your application
You can split out your resource into multiple resources:
If handling requests for .js files, you can have a JSFileResource
If handling requests for favicon.ico, you can have a FaviconFileResource
If handling requests for .css files, you can have a CSSFileResource
You can add services to this resource
You could create an authentication service to only allow logged in users to view certain paths
You have absolutely full control over how responses are sent and how to handle requests to your resources that handle files.

A files resource is not special. It is no different than a resource that will update a user in a database. All you are doing is telling it to handle assets and specific endpoints -- this is your asset resource.
 * 
 */