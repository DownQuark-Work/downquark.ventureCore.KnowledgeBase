import { SETTINGS } from './_settings.ts'

class Cell {
  _amtDied = 0
  _amtLived = 0
  stateCur:number
  _stateNext: number | 'UNSET' = 'UNSET'
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
  gridmap: {[k:string]:Cell} = {}
  constructor(h:number,w:number) {
    this.h = h;
    this.w = w;
  }
  // Creates initial 2D Grid and Assigns Cell
  // type seedFnc = ()=>Array<number[]>
  init(seed?: (x:number,y:number)=>number){
    for(let gX = 0; gX < this.w; gX++) {
      for(let gY = 0; gY < this.h; gY++) {
        const cellInitValue = (typeof seed === 'undefined') ? Math.round(Math.random()) : seed(gX,gY) // TODO: create function(s) to handle seeding
        this.gridmap[`${gX}|${gY}`] = new Cell(gX,gY,cellInitValue)
      }
    }
  }
  cycleLife(){
    console.log('---')
    Object.keys(this.gridmap).forEach(cell => {
      // determine living neighbors
      let livingNeighbors = 0
      const curCellPos = cell.split('|').map(c => parseInt(c,10)),
        curCell = this.gridmap[curCellPos[0]+'|'+curCellPos[1]]
      for(let yy = -1; yy < 2; yy++) {
        for(let xx = -1; xx < 2; xx++) {
          const gmX = curCellPos[0]+xx
          const gmY = curCellPos[1]+yy
          if(!(gmX < 0 || gmY < 0 || gmX > this.w-1 || gmY > this.h-1
            || (gmX === curCellPos[0] && gmY === curCellPos[1]))) // don't check self or out of bounds
          { livingNeighbors += Math.max(Math.min(this.gridmap[gmX+'|'+gmY].stateCur,1),0) }
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
    Object.values(this.gridmap).forEach(cell => cell.applyNextState())
  }
  printGrid(){
    let printRow = []
    for(let gY = 0; gY < this.h; gY++) {
      for(let gX = 0; gX < this.w; gX++) {
        // const renderChar = SETTINGS.RENDER_AS.AGGREGATE(this.gridmap[`${gX}|${gY}`].stateCur)
        // const renderChar = SETTINGS.RENDER_AS.BINARY(this.gridmap[`${gX}|${gY}`].stateCur)
        const renderChar = SETTINGS.RENDER_AS.CHAR(this.gridmap[`${gX}|${gY}`].stateCur,'🀫','🀆')
        printRow.push(renderChar)
      }
      console.log(...printRow)
      printRow = []
    }
  }
}
const gridH = (Deno.args[0] && parseInt(Deno.args[0],10)) ? parseInt(Deno.args[0],10) : SETTINGS.GRID_HEIGHT,
  gridW = (Deno.args[1] && parseInt(Deno.args[1],10)) ? parseInt(Deno.args[1],10) : SETTINGS.GRID_WIDTH
let iterationsRemaining = (Deno.args[2] && parseInt(Deno.args[2],10)) ? parseInt(Deno.args[2],10) : SETTINGS.ITERATIONS

const grd = new Grid(gridH, gridW)
grd.init()

grd.printGrid()
while(iterationsRemaining)
{
  grd.cycleLife()
  grd.printGrid()
  iterationsRemaining--
}
