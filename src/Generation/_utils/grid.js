// TODO: convert to ts
// - instead of "real" 2d arrays utilize `Map`, `Set` & `Symbol` to make 1d arrays that can act as nd arrays.

class dqGrid {

  constructor({dimensions,defaultValues=[0]}) {
    if (!Object.keys(dimensions).length) throw new Error('dimensions required')
    this.dimensions = dimensions
    this.defaultValues = defaultValues
    this.totalCells = Object.values(dimensions).reduce((a,c) => a*c, [1])
    this.GRID = {
      dims: {...dimensions},
      totalCells: this.totalCells
    }

    this.createMapGrid()
  }

  createMapGrid() {
    const gridEnt = Object.entries(this.dimensions)
    const dimByPos = new Array(gridEnt.length)
    const dimMap = new Map()
    let arrSize = 0 // prevents divide by zero

    for(let i=gridEnt.length-1; i>-1; i--) {
      const dimensionLen = arrSize
        ? arrSize*gridEnt[i][1] === this.totalCells ? 1 : arrSize*gridEnt[i][1]
        : gridEnt[i][1] // this.totalCells
      // console.log('Xx', arrSize, `${dimensionLen} ${gridEnt[i][0]} with ${this.totalCells/dimensionLen} indexes to fill`)
      dimMap.set(gridEnt[i][0], new Array(dimensionLen).fill([]))
      arrSize = arrSize ? arrSize*gridEnt[i][1] : gridEnt[i][1]

      this.GRID[gridEnt[i][0]] = {}
      this.GRID[gridEnt[i][0]].position = i
      // this.GRID[gridEnt[i][0]].dimensions = dimMap.get(gridEnt[i][0])
      dimByPos[i] = gridEnt[i][0]
    }
    console.log(dimByPos) // dimByPos: ['col', 'row', 'lvl']
    
    for(let j=0; j<arrSize; j++) { // sets base position which is a single array
      dimMap.get(dimByPos[0])[j] = this.defaultValues[j%this.defaultValues.length]
    }

    const fillDims = (curDim) => {
      const chunkSize = this.totalCells/dimMap.get(curDim).length
      const indexes = new Array(dimMap.get(dimByPos[0]).length).fill().map((_,i)=>i)
      console.log('indexes', indexes)

      // dimMap.set(curDim, dimMap.get(dimByPos[0]).reduce((all,one,i) => { // use mapped val to keep things intertwined
      //   const ch = Math.floor(i/chunkSize)
      //   all[ch] = [].concat((all[ch]||[]),one)
      //   // console.log('i,ch,all', i,ch,all)
      //   return all
      // }, []))

      const chunks = dimMap.get(dimByPos[0]).reduce((all,one,i) => { // use mapped val to keep things intertwined
        const ch = Math.floor(i/chunkSize)
        all[ch] = [].concat((all[ch]||[]),one)
        // console.log('i,ch,all', i,ch,all)
        return all
      }, [])
      
      // dimMap.set(curDim), dimMap.get(dimByPos[0])
      console.log('curDimX', dimMap.get(curDim), dimMap.keys())
      // chunks.forEach((chnk,k) => {
      //   dimMap.get(curDim)[k] = new Array(chunkSize)
      //   // dimMap.get(curDim)[k] = chnk
      //   chnk.forEach((cnk,l) => {
      //     // console.log('cnk', cnk)
      //     // console.log('dimMap.get(curDim)[k][l]', dimMap.get(curDim),k,l)
      //     dimMap.get(curDim)[k][l] = dimMap.get(dimByPos[0])[cnk]
      //   })
      // })
    }
    
    dimByPos.forEach((pos,indx) => {
      if (indx === 0) return // already set to full array
      fillDims(pos)
    })
    
    dimByPos.forEach((curPos,i) => {
      this.GRID[curPos].dimensions
    })
    
    console.log('.dimMap', dimMap)
    console.log('.this.GRID.col', this.GRID.col.dimensions)
    console.log('.this.GRID.row', this.GRID.row.dimensions)
    console.log('.this.GRID.lvl', this.GRID.lvl.dimensions)
    dimMap.get('col')[13] = 'X'
    // dimMap.get('lvl')[1][3] = 'Z'
    console.log(':dimMap', dimMap)
    console.log(':this.GRID.col', this.GRID.col.dimensions)
    console.log(':this.GRID.row', this.GRID.row.dimensions)
    console.log(':this.GRID.lvl', this.GRID.lvl.dimensions)
  }
}

const dqGridSettings = {
  dimensions: {
    col: 4,
    row: 2,
    lvl: 3,
  },
  defaultValues: ['a','b','c'] // new Array(4*2*3).fill(0).map((_,i) => i)
}
const gameGrid = new dqGrid(dqGridSettings)

/*
```

End result will be something like:
this.GRID.printGrid =>
------
|0000|
|0000|
------
------
|0000|
|0000|
------
------
|0000|
|0000|
------

// zero based index
this.GRID.getCell(5) // 2nd row, 2nd col
this.GRID.getCell(1,1) // 2nd row, 2nd col
-
this.GRID.getCell(14) // 2nd lvl 2nd row, 3nd col
this.GRID.getCell(1,1,2) // 2nd lvl 2nd row, 3nd col
*/