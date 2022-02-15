import { SETTINGS } from './_settings.ts'
import { PRNG } from '../_Seed/prng.ts'

class Cell {
  private _amtDied = 0
  private _amtLived = 0
  stateCur:number
  private _stateNext: number | 'UNSET' = 'UNSET'
  readonly x: number
  readonly y: number
  constructor(x:number,y:number,a:number) {
    this.x = x;
    this.y = y;
    this.stateCur = a
    
  }
  storeNextState(survived = false){
    (survived)
      ? SETTINGS.RENDER_AGGREGATE_DELTA // only matters if RENDER_AS === AGGREGATE
        ? this._stateNext = ++this._amtLived + this._amtDied
        : this._stateNext = ++this._amtLived
      : SETTINGS.RENDER_AGGREGATE_DELTA // only matters if RENDER_AS === AGGREGATE
        ? this._stateNext = this._amtLived + --this._amtDied
        : this._stateNext = --this._amtDied
  }
  applyNextState(){
    
    if (typeof this._stateNext === 'number') this.stateCur = this._stateNext
    this._stateNext = 'UNSET'
  }
}

class Grid {
  comparisonGrid:Array<string[]> = [['GRID_INIT']]
  verifySeed = 0
  private _gridmap: {[k:string]:Cell} = {}
  readonly h: number
  readonly w: number
  constructor(h:number,w:number) {
    this.h = h;
    this.w = w;
  }
  // Creates initial 2D Grid and Assigns Cell
  init(seed:string[]){
    const _seed = [...seed]
    // let verifySeed = 0
    for(let gX = 0; gX < this.w; gX++) {
      for(let gY = 0; gY < this.h; gY++) {
        const cellInitValue = _seed[0] ? _seed.shift() : Math.round(Math.random()).toString()
        this._gridmap[`${gX}|${gY}`] = cellInitValue
          ? new Cell(gX,gY,parseInt(cellInitValue,10)%2) // change modulo for differing amount of initial live cells
          : new Cell(gX,gY,0)
        this.verifySeed += cellInitValue ? parseInt(cellInitValue,10) : 0
      }
    }
  }
  cycleLife(){
    Object.keys(this._gridmap).forEach(cell => {
      // determine living neighbors
      let livingNeighbors = 0
      const curCellPos = cell.split('|').map(c => parseInt(c,10)),
        curCell = this._gridmap[curCellPos[0]+'|'+curCellPos[1]]
      for(let yy = -1; yy < 2; yy++) {
        for(let xx = -1; xx < 2; xx++) {
          const gmX = curCellPos[0]+xx
          const gmY = curCellPos[1]+yy
          if(!(gmX < 0 || gmY < 0 || gmX > this.w-1 || gmY > this.h-1
            || (gmX === curCellPos[0] && gmY === curCellPos[1]))) // don't check self or out of bounds
          { livingNeighbors += Math.max(Math.min(this._gridmap[gmX+'|'+gmY].stateCur,1),0) }
        }
      }
      if(curCell.stateCur > 0)
      { // currently alive
        if(SETTINGS.SURVIVING_CELL_RANGE.includes(livingNeighbors))
        { curCell.storeNextState(true) } else { curCell.storeNextState() }
      }
      else {
        if(SETTINGS.TO_LIFE_RANGE.includes(livingNeighbors))
        { curCell.storeNextState(true) } else { curCell.storeNextState() }
      }
    })
    Object.values(this._gridmap).forEach(cell => cell.applyNextState())
  }

  finalizeGrid(golArr?:Array<Array<string[]>> ){
    let printRow = []
    const returnGrid:Array<string[]> = []
    for(let gY = 0; gY < this.h; gY++) {
      for(let gX = 0; gX < this.w; gX++) {
        // const renderChar = SETTINGS.RENDER_AS.AGGREGATE(this._gridmap[`${gX}|${gY}`].stateCur)
        const renderChar = SETTINGS.RENDER_AS.BINARY(this._gridmap[`${gX}|${gY}`].stateCur)
        // const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'•','°')
        // const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'🀫','🀆')
        // const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'cell-active','cell-inactive')
        printRow.push(renderChar)
      }
      returnGrid.push([...printRow])
      !golArr && console.log(...printRow)
      printRow = []
    }
    if(JSON.stringify(this.comparisonGrid).replace(/^-.*/g,'0').replace(/[1-9]+/g,'1') === JSON.stringify(returnGrid).replace(/^-.*/g,'0').replace(/[1-9]+/g,'1')){ return this.comparisonGrid = [['REPEATING_PATTERN']]}
    this.comparisonGrid = returnGrid
    golArr && golArr.push(returnGrid)
  }
}

const parseSeedArg = (seedArg:number) => {
  cellularAutomataReturnObject.seedArg = seedArg
  const cellAmt = gridW * gridH
  // deno-lint-ignore no-explicit-any
  const seed = new (PRNG as any)(seedArg)
  let seededStr = ''
  while(seededStr.replace(/[^0-9]/g,'').length < cellAmt) seededStr += seed.next(10,100)
  seededStr = seededStr.replace(/[^0-9]/g,'').slice(0,cellAmt)
  return seededStr.split('')
}

const cellularAutomataReturnObject: {
  iterations_run?:number
  CellularAutomata?:Array<Array<string[]>>,
  seedArg?:number,
  verifySeed?:number
} = {}
const gridW = (Deno.args[0] && parseInt(Deno.args[0],10)) ? parseInt(Deno.args[0],10) : SETTINGS.GRID_HEIGHT,
  gridH = (Deno.args[1] && parseInt(Deno.args[1],10)) ? parseInt(Deno.args[1],10) : SETTINGS.GRID_WIDTH,
  seedArg = Deno.args[3] ? parseSeedArg(parseInt(Deno.args[3],10)) : parseSeedArg(new Date().getTime())
let iterationsRemaining = (Deno.args[2] && parseInt(Deno.args[2],10)) ? parseInt(Deno.args[2],10) : SETTINGS.ITERATIONS
const grd = new Grid(gridH, gridW)
grd.init(seedArg)

let curIt = 0
if(iterationsRemaining < 1)
{ // used for continuous animation
  const itInterval = setInterval(() => {
    if (grd.comparisonGrid[0][0] === 'REPEATING_PATTERN') {
      clearInterval(itInterval)
      console.log('final')
      return
    }
    console.clear()
    grd.cycleLife()
    grd.finalizeGrid()
    console.log(`::iterations run:: ${++curIt}`)
  }, 300)
}
else
{ // used to create a fixed array of lifecycles and output the result
  const CellularAutomataSteps:Array<Array<string[]>> = []
  let CellularAutomata:Array<Array<string[]>> = []
  while(grd.comparisonGrid[0][0] !== 'REPEATING_PATTERN' && iterationsRemaining)
  {
    grd.cycleLife()
    grd.finalizeGrid(CellularAutomataSteps)
    iterationsRemaining--
    CellularAutomata = [CellularAutomataSteps[CellularAutomataSteps.length-1]]
    ++curIt
  }
  CellularAutomata = (SETTINGS.RETURN_ALL_STEPS) ? CellularAutomataSteps : CellularAutomata
  cellularAutomataReturnObject.CellularAutomata = CellularAutomata
  cellularAutomataReturnObject.verifySeed = grd.verifySeed
  cellularAutomataReturnObject.iterations_run = curIt
  console.log(JSON.stringify(cellularAutomataReturnObject))
}
