// deno run -c deno.jsonc ./CellularAutomata/cellular_automata.ts 35 20 12 - specify config file for use with both DOM and CLI
// deno bundle -c deno.jsonc ./CellularAutomata/cellular_automata.ts ../../src/Gaming/RogueLike/development/Browser/Application/rogue/js/rogue/cellular_automata.bundle.js
import { SETTINGS } from './_settings.ts'

import {parseSeed, parsedVerifiedValue} from '../_utils/_seed.ts'
import {renderGrid} from '../_utils/cli-view.ts'

const _DEBUG = false

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
  init(seed:string[], oGASI:()=>void){
    const _seed = [...seed],
    _onGridAndSeedInit = oGASI
    for(let gX = 0; gX < this.w; gX++) {
      for(let gY = 0; gY < this.h; gY++) {
        const cellInitValue = _seed[0] ? _seed.shift() : Math.round(Math.random()).toString()
        this._gridmap[`${gX}|${gY}`] = cellInitValue
          ? new Cell(gX,gY,parseInt(cellInitValue,10)%2) // change modulo for differing amount of initial live cells
          : new Cell(gX,gY,0)
      }
    }
    this.comparisonGrid = [[]]
    _onGridAndSeedInit()
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
        printRow.push(renderChar)
      }
      returnGrid.push([...printRow])
      printRow = []
    }
    if(JSON.stringify(this.comparisonGrid).replace(/^-.*/g,'0').replace(/[1-9]+/g,'1') === JSON.stringify(returnGrid).replace(/^-.*/g,'0').replace(/[1-9]+/g,'1')){ return this.comparisonGrid = [['REPEATING_PATTERN']]}
    this.comparisonGrid = returnGrid
    golArr ? golArr.push(returnGrid) : renderGrid(returnGrid)
  }
}

const parseSeedArg = (seedArg:number) => {
  cellularAutomataReturnObject.seedArg = seedArg
  const seed = parseSeed(seedArg, (gridW * gridH))
  return seed
}

const cellularAutomataReturnObject: {
  iterations_run?:number
  CellularAutomata?:Array<Array<string[]>>,
  seedArg?:number,
  verifySeed?:number
} = {}

// `$ deno doc ./CellularAutomata/cellular_automata.ts` to see the below working
// https://deno.land/manual@v1.18.1/tools/documentation_generator
/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} Sum of x and y
 */
let curIt = 0
const onGridAndSeedInit = () => {
  if(iterationsRemaining < 1)
  { // used for continuous animation
    const itInterval = setInterval(() => {
      if (grd.comparisonGrid[0][0] === 'REPEATING_PATTERN') {
        clearInterval(itInterval)
        console.log('final')
        return
      }
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
    cellularAutomataReturnObject.verifySeed = parsedVerifiedValue()
    cellularAutomataReturnObject.iterations_run = curIt
    typeof Deno !== 'undefined' && console.log(JSON.stringify(cellularAutomataReturnObject))
  }
}

let gridW:number, gridH:number, seedArg:string[], iterationsRemaining = 0, grd:any
// Browser
export const initCellularAutomata = (props:{gw?:number, gh?:number, sa?:number, ir?:number}) => {
  _DEBUG && console.log('props', props)
  gridW = props.gw || SETTINGS.GRID_WIDTH,
  gridH = props.gh || SETTINGS.GRID_HEIGHT,
  seedArg = props.sa ? parseSeedArg(props.sa) : parseSeedArg(new Date().getTime())
  iterationsRemaining = props.ir || SETTINGS.ITERATIONS
  grd = new Grid(gridH, gridW)
  grd.init(seedArg, onGridAndSeedInit)
  return cellularAutomataReturnObject
}
// Deno
if(typeof Deno !== 'undefined' && Deno?.args.length){ // allow to be run from command line
  const gw = Deno.args?.[0] && parseInt(Deno.args[0],10) || 0,
        gh = Deno.args?.[1] && parseInt(Deno.args[1],10) || 0,
        sa = Deno.args?.[2] && parseInt(Deno.args[2],10) || 0,
        ir = Deno.args?.[3] && parseInt(Deno.args[3],10) || 0
  initCellularAutomata({ gw, gh, sa, ir})
}