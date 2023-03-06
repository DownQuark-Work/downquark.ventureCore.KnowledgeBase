// @ts-nocheck // @deno-nocheck
import {PARSE_RANDOM} from './_constants.ts'

const seedPointersIndexMap = [], // holds reference to the `pointerName` stored on the weakmap
      SeedPointersMap = new WeakMap()

const parseSeedAtPos = (raw,offset,sp) => {
  if(!''._Seed?.length) return sp.seedIndex+=offset
  sp.seedIndex=sp.seedIndex+offset
  if(sp.seedIndex<0) sp.seedIndex = ''._Seed.length-1
  if(sp.seedIndex>=''._Seed.length) sp.seedIndex = 0
  if(raw) return sp.seedIndex
  return parseInt(''._Seed.at(sp.seedIndex),10)
}

// `opts` is an array of valid values to be returned based on current seeded value
const parseOptionWithSeedValue = (sp,opts,autoInc=false) => {
  const curOPt = Array.isArray(opts)
    ? opts
    : opts.RANGE || PARSE_RANDOM[opts]
  if(!Array.isArray(curOPt))
    throw new Error('options property must be valid array, `procgen/_constants.ts` key or have shape of {RANGE:[min,max]}')
  if(!curOPt.length)
    throw new Error('options property must have a length')
  const lenDiff = opts.RANGE ? curOPt[1] - curOPt[0] : curOPt.length
    // to gain another level of recurse all 10 options for each group must have at least 10 options of their own with at least one extra
      // 42 opts = 10*4.2 === 1 level // 420 opts = 10*10*4.2 === 2 levels // 1001 opts = 10*10*10.01 === 3 levels 
      // 1000 opts = 10*10*10 === 2 levels // if exact then remove a level of recurse
    const groupRecurseAmt = /^10+$/g.test(''+lenDiff) ? (''+lenDiff).length-2 : (''+lenDiff).length-1
    const remainder = lenDiff/Math.pow(10,groupRecurseAmt)
    let finalAnswer = 1
    for(let i=groupRecurseAmt; i>0;i--){
        // keep LOWEST & HIGHEST VALUE for debug
      // finalAnswer *= 10/(10) // LOWEST VALUE
      // finalAnswer *= 10/(1) // HIGHEST VALUE
      finalAnswer *= 10/(parseSeedAtPos(false,0,sp)+1) // Do not divide by zero
    }
      // keep LOWEST & HIGHEST VALUE for debug
    // finalAnswer *= Math.max(remainder-(remainder*((remainder*(9))/(remainder*10))),1) // LOW VALUE
    // finalAnswer *= Math.max(remainder-(remainder*((remainder*(0))/(remainder*10))),1) // HIGHEST VALUE
    finalAnswer *= Math.max(remainder-(remainder*((remainder*(parseSeedAtPos(false,1,sp)))/(remainder*10))),1)

    --finalAnswer // reset to use zero index
    finalAnswer = Math.round(finalAnswer)

    if(autoInc) sp.inc() // increase if `walk` is enabled
    // return between [min,max) range for RANGE object _OR_ 0 based index for array
    return opts.RANGE ? finalAnswer + curOPt[0] : curOPt[finalAnswer]
}

export const registerSeedPointer = (
  pointerName = 'seed-pointer',
  currentSeedPointerIndex = 0, // starting position within the seed for all instance logic
) => {
  if(seedPointersIndexMap.length) pointerName = pointerName+'-'+seedPointersIndexMap.length.toString()
  else pointerName = 'BASE_SEED_POINTER' // force name for initial seed pointer
  const seedPointer = {
    indx: seedPointersIndexMap.length,
    name: pointerName,
    seedIndex: currentSeedPointerIndex
  }
  seedPointer.dec = rawVal => parseSeedAtPos(rawVal,-1,seedPointer)
  seedPointer.get = options => parseOptionWithSeedValue(seedPointer,options)
  seedPointer.inc = rawVal => parseSeedAtPos(rawVal,1,seedPointer)
  seedPointer.setPointer = pointerPosition => { seedPointer.seedIndex = pointerPosition; return pointerPosition }
  seedPointer.walk = options => parseOptionWithSeedValue(seedPointer,options,true)
  
  seedPointersIndexMap.push({pointerName})
  SeedPointersMap.set(
    seedPointersIndexMap.at(-1),
    seedPointer)
  // console.log('seedPointersIndexMap: ', seedPointersIndexMap)
  return SeedPointersMap.get(seedPointersIndexMap.at(-1)) // SeedPointersMap[pointerName]
}

export const deregisterSeedPointer = keypos => {
  if(typeof keypos === 'undefined')
    throw new Error('deregisterSeedPointer must include a seed pointer to remove')
  if(keypos===0||keypos==='BASE_SEED_POINTER') throw new Error('cannot deregister BASE_SEED_POINTER')

  let seedDeregistered = false,
      indexByPointName = null
  if (typeof keypos === 'number'){
    seedDeregistered = SeedPointersMap.delete(seedPointersIndexMap.at(keypos))
  }
  else if (typeof keypos === 'string'){
    seedPointersIndexMap.forEach((iMap,i) => {
      if (iMap.pointerName === keypos){indexByPointName = i; return}
    })
    if(indexByPointName) {
      seedDeregistered = SeedPointersMap.delete(seedPointersIndexMap.at(indexByPointName))
    }
  }
  else throw new Error('invalid prop type passed ot deregisterSeedPointer')
  
  // console.log('seedPointersIndexMap: A', ...seedPointersIndexMap)
  if(seedDeregistered){
    seedPointersIndexMap.splice(indexByPointName||keypos,1)
  }
  // console.log('seedPointersIndexMap: Z', ...seedPointersIndexMap)

  // seedDeregistered will be false when no seed found with specified prop.
  return seedDeregistered // There may be valid resons for this, do not throw
}