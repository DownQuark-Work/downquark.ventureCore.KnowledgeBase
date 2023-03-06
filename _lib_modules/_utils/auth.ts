import { encode as be } from '../_deps.ts'

export const jWT = async (data: {[k:string] : string}): Promise<string> => {
  // example data shape
  const te = (d: string) => new TextEncoder().encode(d);
  const k = await crypto.subtle.importKey("raw", Uint8Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  const p = be(te(JSON.stringify({ alg: "HS256", typ: "JWT" }))) + "." + be(te(JSON.stringify(data))),
        jwt = p + "." + be(new Uint8Array(await crypto.subtle.sign({ name: "HMAC" }, k, te(p))));
  console.log('jwt: ', jwt)
  return jwt
}