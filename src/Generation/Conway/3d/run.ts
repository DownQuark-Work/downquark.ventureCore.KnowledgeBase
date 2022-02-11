import { SETTINGS } from './_settings.ts'

class Cell {
  _amtDied = 0
  _amtLived = 0
  stateCur:number
  stateNext: number | 'UNSET' = 'UNSET'
  readonly x: number
  readonly y: number
  constructor(x:number,y:number,a:number) {
    this.x = x;
    this.y = y;
    this.stateCur = a
    console.log(`Created cell at position: ${this.x},${this.y} with current state ${this.stateCur}`);
    
  }
  storeNextState(){
    // if lived
    // - increment _amtLived
    // - stateNext = _amtLived
    // if died
    // - decrement _amtDied
    // - stateNext = _amtDied
    // _OR_
    // - stateNext = _amtLived - _amtDied <- may make fun results
  }
  applyNextState(){
    // set stateCur to stateNext
    // - do this only _after_ every cell has stateNext defined
    // set stateNext to UNSET
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
    console.log('repeating: ', iterations)
  }
  printGrid(){
    let printRow = []
    for(let gY = 0; gY < this.h; gY++) {
      for(let gX = 0; gX < this.w; gX++) {
        printRow.push(this.gridmap[`${gX}|${gY}`].stateCur)
      }
      console.log(...printRow)
      printRow = []
    }
  }
}
const gridH = (Deno.args[0] && parseInt(Deno.args[0],10)) ? parseInt(Deno.args[0],10) : SETTINGS.GRID_HEIGHT,
  gridW = (Deno.args[1] && parseInt(Deno.args[1],10)) ? parseInt(Deno.args[1],10) : SETTINGS.GRID_WIDTH,
  iterations = (Deno.args[2] && parseInt(Deno.args[2],10)) ? parseInt(Deno.args[2],10) : SETTINGS.ITERATIONS

const grd = new Grid(gridH, gridW)
grd.init()
// console.log('printGrid', grd.printGrid)
grd.printGrid()

// console.log('SETTINGS', SETTINGS)