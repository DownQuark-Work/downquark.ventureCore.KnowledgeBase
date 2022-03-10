import { Drash } from "../../../../deps.ts";
import { PrefixedBaseResource } from "../prefixed_base_resource.ts";

export class PrefixedExampleResource extends PrefixedBaseResource {
  public paths = this.prefixPaths("dq_v1", ["/users", "/users/:id"]);
  // The above will be transformed to the following:
  //
  //   - /api/v1/users
  //   - /api/v1/users/:id

  public GET(request: Drash.Request, response: Drash.Response): void {
    return response.text("Prefixed v1 route!");
  }
}