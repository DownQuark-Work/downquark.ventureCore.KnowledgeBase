// @ts-nocheck: TODO - add simple type checking

/**
 * @param {number} columns
 * @param {number} rows
 * @param {any} _thisArg
 */
function _grid(columns, rows, squared = true, _thisArg, _typed = 'CELLULAR') {
  const that = _thisArg || this // old-school way was more performant than applying/binding `this` correctly through all edge cases
  // - although I would like to give it one more try with [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
  if(!(columns && rows))
    throw new Error('Column and Row count must be defined when creating a Grid');
  if(!(that.clientWidth && that.clientHeight))
    throw new Error('Canvas element must have a defined width and height');
    
  let cellH, cellW
  cellH = Math.floor(that.clientHeight / rows)
  cellW = Math.floor(that.clientWidth / columns)
  if(squared) {
    cellH = Math.min(cellH,cellW)
    cellW = cellH
  }
  that.Grid.TYPE = _typed
  that.Grid.AMT.COL = columns
  that.Grid.AMT.ROW = rows
  that.Grid.CELL.H = cellH
  that.Grid.CELL.W = cellW
  that.Grid.MAP = new Array(columns*rows).fill(0)

  // for(const v in that.Grid) {
  //   console.log('that.Grid['+v+']: ', that.Grid[v])
  // }
}

/**
 * @param {number} c
 * @param {number} r
 * @param {boolean | undefined} s
 */
function _carve(c,r,s) {
  if(!(c%2)) c++; if(!(r%2)) r++ // must be odd number of columns and rows
  _grid(c,r,s, this,'CARVED')

  // overwrite initial array with required values for carved grid
  this.Grid.MAP = this.Grid.MAP.map((/** @type {any} */ _v,/** @type {number} */ i) => {
    if(!(Math.floor(i/c)%2)) return 0 // odd rows are inactive
    if(!(i%2)) return 1 // active for odd indexes on even rows
    return 0 // inactive for even indexes on even rows
  })
  this.Grid.MAP.splice((-1*c),c,...new Array(c).fill(0)) // last row is solid bounding box
  // console.log('this.Grid.MAP: ', this.Grid.MAP)
}

/**
 * @param {number} i
 * @param {number} r
 */
function _position(i,r) {
  if(i<0 || r<0 || isNaN(i)) throw new Error('Column and/row value is out of bounds')
  
  // column, row passed in, expecting index
  if(!isNaN(r)) {
    if(i>=this.Grid.AMT.COL || r>=this.Grid.AMT.ROW)
      throw new Error('Column and/row value is out of bounds')
    return (r*this.Grid.AMT.COL) + i
  }

  // index passed in, expecting column, row
  if(i>=this.Grid.MAP.length || r) throw new Error('Column and/row value is out of bounds')
  const colPos = () => i%this.Grid.AMT.COL,
        rowPos = () => Math.floor(i/this.Grid.AMT.COL)
  return { col:colPos(), row:rowPos() }
}
function _renderBaseContext() {
  if(this.RenderBaseContext.instantiated) throw new Error('RenderBaseContext can only be called once per grid')

  const bounds = this.getBoundingClientRect()
  if(!this.getAttribute('height')) this.setAttribute('height', Math.floor(bounds.height))
  if(!this.getAttribute('width')) this.setAttribute('width', Math.floor(bounds.width))

  const ctx = this.getContext('2d')
  this.Grid.MAP.forEach((/** @type {any} */ cell,/** @type {any} */ indx) => {
    const gridPosition = _position.apply(this,[indx])
    ctx.save();
    switch(this.Grid.TYPE){
      case 'CARVED': // CARVED
        ctx.fillStyle = cell ? 'rgb(100,100,100)' : 'rgb(0,0,0)'
        ctx.translate(gridPosition.col * this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H);
        ctx.fillRect(0, 0, this.Grid.CELL.W, this.Grid.CELL.H);
        break
      default: // CELLULAR
        ctx.strokeStyle = 'rgb(10,10,10)'
        ctx.beginPath();
        ctx.moveTo(gridPosition.col * this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H)
        ctx.lineTo(gridPosition.col * this.Grid.CELL.W+this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H)
        ctx.lineTo(gridPosition.col * this.Grid.CELL.W+this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H+this.Grid.CELL.H)
        ctx.lineTo(gridPosition.col * this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H+this.Grid.CELL.H)
        ctx.lineTo(gridPosition.col * this.Grid.CELL.W, gridPosition.row * this.Grid.CELL.H)
        ctx.stroke();
    }
    ctx.restore();
  })
  
  this.RenderBaseContext.instantiated = true
  return ctx
}

/**
 * Allows for:
 * ```
 * const cnvs = document.getElementById('canvas')
 * const grid = cnvs.Grid(13,42)
 * // _OR_
 * const grid = cnvs.CarvedGrid(42,13)
 * ```
 */
// @ts-ignore
HTMLCanvasElement.prototype.Grid = Object.assign(_grid, {
  AMT:{ COL:null, ROW:null, },
  CELL:{ H:null, W:null, },
  MAP:[], // 1d array - each index corresponds to a grid cell
  TYPE:'CELLULAR',
})
// @ts-ignore
HTMLCanvasElement.prototype.CarvedGrid = Object.assign(_carve)

// @ts-ignore
HTMLCanvasElement.prototype.Position = Object.assign(_position)

// @ts-ignore
HTMLCanvasElement.prototype.RenderBaseContext = Object.assign(_renderBaseContext, {
  instantiated: false
})