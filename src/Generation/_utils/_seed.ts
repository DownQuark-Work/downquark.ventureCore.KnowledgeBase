import { PRNG } from '../_PRNG/prng.ts'

let verifiedSeed = 0
export const parseSeed = (preParsedSeed:number, seedLength:number) => {
  // deno-lint-ignore no-explicit-any
  const seed = new (PRNG as any)(preParsedSeed)
  let seededStr = ''
  while(seededStr.length < seedLength) seededStr += String(seed.next(10,100)).replace(/[^0-9]/g,'')
  const seededArr = seededStr.slice(0,seedLength).split('')
  verifiedSeed = seededArr.reduce((a,c)=>a+parseInt(c,10),0)
  console.log('verifiedSeed', verifiedSeed)
  return seededArr
}
export const parsedVerifiedValue = () => verifiedSeed