import { Drash } from '../../../deps.ts'

export class PrefixedBaseResource extends Drash.Resource {
  /**
   * Define a list of prefixes that can be used by resources that extend this class.
   */
  #prefixes: { [k: string]: string } = {
    dq_v1: '/dq/v1',
    dq_v2: '/dq/v2',
  };

  /**
   * Returns the passed in array with each path being prefixed
   *
   * @param prefix - The prefix to use
   * @param paths - The resource paths to prefix
   *
   * @returns The `paths` parameter, but with every item prefixed with `this.#prefix`
   */
  // view with:
  /// $ curl http://localhost:1447/dq/v1/users
  /// $ curl http://localhost:1447/dq/v2/users
  protected prefixPaths(prefix: string, paths: string[]) {
    return paths.map((path) => this.#prefixes[prefix] + path);
  }
  }