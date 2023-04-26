import { Sha256 } from '../_deps.ts'

export const createHashForSeed = (shaSeed:string=crypto.randomUUID()) => new Sha256().update(shaSeed).hex()
export const createNumericalHashForSeed = (shaSeed:string=crypto.randomUUID()):string => {
  console.log('shaSeed: ', shaSeed)
  let baseSeedHash = createHashForSeed(shaSeed)
  let baseSeedAlpha:string|string[] = baseSeedHash.replace(/\d/g,'')
  baseSeedHash = baseSeedHash.replace(/\D/g,'')
  baseSeedAlpha = baseSeedAlpha.split('')
  baseSeedAlpha.forEach((str,i) => { baseSeedHash += Math.round(str.charCodeAt(0)/(i%7+1)) })
  return baseSeedHash.substring(0,64)

}

// Mulberry32, a fast high quality PRNG: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
export const mb32 = (seed:number=3668340011) => (t:number) => (seed=seed+1831565813|0,t=Math.imul(seed^seed>>>15,1|seed),t=t+Math.imul(t^t>>>7,61|t)^t,(t^t>>>14)>>>0)/2**32;

// Very odd "chaotic" PRNG using a counter with variable output.
// args default to golden ratios
/**
 * Usage:
 * ```
 * const next = v3b(seed, 2654435769, 1013904242, 3668340011)
 * // OR with defaults:
 * const next = v3b()
 * for(let i = 0; i < 50; i++) console.log(next());
 * ```
 * @param seed 
 * @param b 
 * @param c 
 * @param d 
 * @returns Pseudo Random Number
 */
export const v3b = (seed:number = -1, b:number = 2654435769, c:number = 1013904242, d:number = 3668340011): ()=>number => {
  if(seed < 0){ seed = parseInt(createNumericalHashForSeed(),10); console.log('createNumericalHashForSeed(): ', seed ) }
  console.log('seedV3B:::: ', seed)
  let out:number, pos = 0, seed0 = 0, b0 = b, c0 = c, d0 = d;
  return function() {
    if(pos === 0) {
      seed += d; seed = seed << 21 | seed >>> 11; b = (b << 12 | b >>> 20) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 19 | seed >>> 13; b = (b << 24 | b >>> 8) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 7 | seed >>> 25; b = (b << 12 | b >>> 20) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 27 | seed >>> 5; b = (b << 17 | b >>> 15) + c;
      c ^= seed; d ^= b; seed += seed0; b += b0; c += c0; d += d0; seed0++; pos = 4;
    }
    switch(--pos) {
      case 0: out = seed; break; case 1: out = b; break;
      case 2: out = c; break; case 3: out = d; break;
    }
    return out >>> 0;
  }
}

// TODO: implement more
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
