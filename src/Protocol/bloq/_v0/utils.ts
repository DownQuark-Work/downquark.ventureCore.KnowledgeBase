/**
 * @summary encodes data for SHA-256
 * @param data string to encode
 * @returns string
 * @usage
 * ```
 * digestData(data)
 *  .then(digestHex => console.log('digestHex', digestHex));
 * ```
 */
export const digestData = async (data:string) => {
  const msgUint8 = new TextEncoder().encode(data);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the data
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
