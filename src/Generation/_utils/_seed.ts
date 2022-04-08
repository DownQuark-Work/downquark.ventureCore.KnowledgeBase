import { PRNG } from '../_PRNG/prng.ts'

let verifiedSeed = 0, seededArr:string[] = [], parsedSeed:number[] = []
let initSeed = 0
export const parseSeed = (preParsedSeed:number, seedLength:number) => {
  seedPointer.pointerValue = 0 // ensure reset
  if(initSeed === preParsedSeed) return seededArr // only create 1 seed at a time
    initSeed = preParsedSeed
  // deno-lint-ignore no-explicit-any
  const seed = new (PRNG as any)(preParsedSeed)
  let seededStr = ''
  while(seededStr.length < seedLength) seededStr += String(seed.next(10,100)).replace(/[^0-9]/g,'')
  seededArr = seededStr.slice(0,seedLength).split('')
  verifiedSeed = seededArr.reduce((a,c)=>a+parseInt(c,10),0)
  
  parsedSeed = seededArr.map(str => parseInt(str,10))
  return seededArr
}
export const parsedVerifiedValue = () => verifiedSeed

// let curSeedPointer = 0
export const seedPointer = (setter?:number) => {
  if(setter) { seedPointer.pointerValue = setter }
  // console.log('->', seedPointer.pointerValue, parsedSeed[seedPointer.pointerValue])
  return seedPointer.autoIncrement ? seedPointer.inc() : parsedSeed[seedPointer.pointerValue]
}
seedPointer.inc = () => {
  if(++seedPointer.pointerValue >= parsedSeed.length) seedPointer.pointerValue = 0
  return parsedSeed[seedPointer.pointerValue]
}
seedPointer.pointerValue = 0
seedPointer.autoIncrement = false