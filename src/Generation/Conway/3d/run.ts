// deno-lint-ignore-file no-case-declarations
import { SETTINGS } from './_settings.ts'

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
    if(survived) {
      this._amtLived++
      this._stateNext = this._amtLived
    } else {
      this._amtDied--
      this._stateNext = this._amtDied
    }
    // _OR_
    // this._stateNext = this._amtLived - this._amtDied <- may make fun results
  }
  applyNextState(){
    if (typeof this._stateNext === 'number') this.stateCur = this._stateNext
    this._stateNext = 'UNSET'
  }
}

class Grid {
  readonly h: number
  readonly w: number
  private _gridmap: {[k:string]:Cell} = {}
  constructor(h:number,w:number) {
    this.h = h;
    this.w = w;
  }
  // Creates initial 2D Grid and Assigns Cell
  //((x:number,y:number)=>number) | Array<number[]>
  init(seed = ''){
    const _seed = seed ? String(seed).split('') : []
    for(let gX = 0; gX < this.w; gX++) {
      for(let gY = 0; gY < this.h; gY++) {
        const cellInitValue = _seed[0] ? _seed.shift() : Math.round(Math.random()).toString()
        this._gridmap[`${gX}|${gY}`] = cellInitValue ? new Cell(gX,gY,parseInt(cellInitValue,10)) : new Cell(gX,gY,0)
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
        if(livingNeighbors >= SETTINGS.SURVIVING_CELL_RANGE[0] && livingNeighbors <= SETTINGS.SURVIVING_CELL_RANGE[1])
        { curCell.storeNextState(true) } else { curCell.storeNextState() }
      }
      else {
        if(livingNeighbors >= SETTINGS.TO_LIFE_RANGE[0] && livingNeighbors <= SETTINGS.TO_LIFE_RANGE[1])
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
        // const renderChar = SETTINGS.RENDER_AS.BINARY(this._gridmap[`${gX}|${gY}`].stateCur)
        // const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'•','°')
        const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'🀫','🀆')
        // const renderChar = SETTINGS.RENDER_AS.CHAR(this._gridmap[`${gX}|${gY}`].stateCur,'class-name-on','class-name-off')
        printRow.push(renderChar)
      }

      golArr ? returnGrid.push(printRow) : console.log(...printRow)
      printRow = []
    }
    golArr && golArr.push(returnGrid)
  }
}

const parseSeedArg = (seedArg:string) => {
  if(!/^.[1-9]+$/g.test(seedArg)) return '' // seed is allowed 1 non-numeric character and then only numbers
  const parseType = (/^[^0-9]/g.test(seedArg)) ? seedArg.slice(0,1) : 'DEFAULT' // parse type is for scalable future solutions
  seedArg = seedArg.replace(parseType,'')
  const cellAmt = gridW * gridH
  switch (parseType)
  { // future scalability stub
    case 'DEFAULT':
    default :
      let seedBinary = parseInt(seedArg,10).toString(2)
      while(seedBinary.length < cellAmt)
      { seedBinary = parseInt(seedBinary,10).toString(2) }
      console.log('seedBinary', seedBinary)
      return seedBinary.slice(0,cellAmt)
  }
}

const gridH = (Deno.args[0] && parseInt(Deno.args[0],10)) ? parseInt(Deno.args[0],10) : SETTINGS.GRID_HEIGHT,
  gridW = (Deno.args[1] && parseInt(Deno.args[1],10)) ? parseInt(Deno.args[1],10) : SETTINGS.GRID_WIDTH,
  seedArg = Deno.args[3] ? parseSeedArg(Deno.args[3]) : ''
let iterationsRemaining = (Deno.args[2] && parseInt(Deno.args[2],10)) ? parseInt(Deno.args[2],10) : SETTINGS.ITERATIONS

console.log('seedArg', seedArg)
const grd = new Grid(gridH, gridW)
grd.init(seedArg)

if(iterationsRemaining < 0)
{ // used for continuous animation
  setInterval(() => {
    console.clear()
    grd.cycleLife()
    grd.finalizeGrid()
  }, 300)
}
else
{ // used to create a fixed array of lifecycles and output the result
  const GameOfLife:Array<Array<string[]>> = []
  while(iterationsRemaining)
  {
    grd.cycleLife()
    grd.finalizeGrid(GameOfLife)
    iterationsRemaining--
  }
  console.log('GameOfLife', GameOfLife)
}
