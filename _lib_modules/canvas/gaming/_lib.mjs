// @ts-nocheck: TODO - add simple typechecking
import {GRID} from '../_constants.mjs'

let _BASE_SEED_POINTER = null
console.log('GRID: ', GRID)
export const _gamingLib = async (gamingContext, seedVal = Date.now()) => {
  console.log('GamingLibContext: ', gamingContext)
  console.log('gamingContext.Grid.AMT: ', gamingContext.canvas.Grid.AMT)
  // console.log('Object.entries(gamingContext.canvas.Grid): ', Object.entries(gamingContext.canvas.Grid))
  const gridDimensions = JSON.stringify(gamingContext.canvas.Grid.AMT)
  
  // making decision to store on string prototype to have it fully available on the front end
  String.prototype._Seed = (await import(`../../procgen/seed.ts?gridDimensions=${gridDimensions}&seedVal=${seedVal}`)).ServerResponse.SeededString;
  // console.log('Seed: ', ''._Seed, ''._Seed.length)
  const {registerSeedPointer} = (await import(`../../procgen/seed.parser.ts`));
  _BASE_SEED_POINTER = registerSeedPointer('_BASE_SEED_POINTER-will always be named "_BASE_SEED_POINTER"')
  
  /* // testing with range // good seed for POC: 1667742629051
  // String.prototype._Seed = '0000000000000000' // will return highest value
  // String.prototype._Seed = '9999999999999999' // will return zero
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('SURROUNDING'))
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('BOOL'))
  console.log('_BASE_SEED_POINTER.get({RANGE:[13,420]}): ', _BASE_SEED_POINTER.get({RANGE:[13,420]}))
  console.log('_BASE_SEED_POINTER.get([...Array(23).keys()]): ', _BASE_SEED_POINTER.get([...Array(23).keys()]))
  /**/

  /* // get option with seeding
  _BASE_SEED_POINTER.setPointer(0)
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('SURROUNDING'))
  _BASE_SEED_POINTER.inc()
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('SURROUNDING'))
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('SURROUNDING')) // same as above
  _BASE_SEED_POINTER.inc()
  console.log('_BASE_SEED_POINTER.get(BOOL): ', _BASE_SEED_POINTER.get('SURROUNDING'))
  console.log('_BASE_SEED_POINTER.walk(BOOL): ', _BASE_SEED_POINTER.walk('SURROUNDING')) // same as above
  console.log('_BASE_SEED_POINTER.walk(BOOL): ', _BASE_SEED_POINTER.walk('SURROUNDING'))
  console.log('_BASE_SEED_POINTER.walk(BOOL): ', _BASE_SEED_POINTER.walk('SURROUNDING'))
  /**/
  
  /* // Increment and decrement examples
  console.log('_BASE_SEED_POINTER.inc()',_BASE_SEED_POINTER.inc())
  console.log('_BASE_SEED_POINTER.dec()',_BASE_SEED_POINTER.dec())
  console.log('_BASE_SEED_POINTER.dec(true)',_BASE_SEED_POINTER.dec(true))
  console.log('_BASE_SEED_POINTER.dec()',_BASE_SEED_POINTER.dec())
  console.log('_BASE_SEED_POINTER.inc(true)',_BASE_SEED_POINTER.inc(true))
  console.log('_BASE_SEED_POINTER.inc()',_BASE_SEED_POINTER.inc())
  /**/
  
  /* // Register and Deregister examples
  const POC_CHARACTER_SEED_POINTER = registerSeedPointer('@', 13)
  const POC_ENEMY_SEED_POINTER_a = registerSeedPointer('X', 69)
  const POC_ENEMY_SEED_POINTER_b = registerSeedPointer('X', 42)
  console.log('seedPointerMain: ', POC_CHARACTER_SEED_POINTER)
  console.log('seedPointerMain: ', POC_ENEMY_SEED_POINTER_a)
  console.log('seedPointerMain: ', POC_ENEMY_SEED_POINTER_b)
  console.log('POC: ', deregisterSeedPointer(1))
  console.log('POC: ', deregisterSeedPointer(-1))
  console.log('POC: ', deregisterSeedPointer('X-2'))
  console.log('POC: ', deregisterSeedPointer('X-2'))
  /**/
}

const _renderOnCanvas = async type => {
  // this can be optimized quite a bit.. jsut needing it to be hooked up first
  let renderResult
  switch (type) {
    case 'BASE_ROOMS':
      renderResult = (await import('./render/base/rooms.ts'))
      break
    case 'BASE_CORRIDORS':
      renderResult = (await import('./render/base/maze.ts'))
      break
  }
  console.log('return this -> rendering: ', renderResult)
}

export const GamingLib = Object.assign(_gamingLib, {
  BASE_SEED_POINTER:() => _BASE_SEED_POINTER,
  RenderOnCanvas:_renderOnCanvas,
})

// reference:
// /** Option 1 */ const Seed = (await import(`../../procgen/seed.ts?gridDimensions=${gridDimensions}&seedVal=${seedVal}`)).ServerResponse; console.log('Seed opt1: ', Seed, Seed.SeededString, Seed.SeededString.length)
// /** Option 2 */ const Seed = (await import('../../procgen/seed.ts')); console.log('Seed opt2: ', Seed.Seed)
// /** Option 3 */ const Seed = await import('../../procgen/seed.ts').then(({Seed}) => {console.log('INSIDE:', Seed); return Seed}); console.log('Seed opt3: ', Seed)