// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313 --prim --anim 225)
// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 1313 --walled)
// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 42 --anim)
// fun seed: deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1 --anim --prikm) 
// larger: deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 25 -c 30 -s 1369 --anim 100 --prim)
// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 25 -c 17 -s 42 --hak --anim 120) <-- seed that exposed a few bugs
// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 25 -c 17 -s 421369 --hak --anim 100)
//// deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 20 -c 48 -s 13 --hak --anim 1) <--!!
//  deno run Layouts/Maze/primtracker.ts $(deno run Layouts/Maze/_base.ts -r 16 -c 18 -s 1649298811519 --hak --anim 1) 

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {CELL_STATE, RENDER_MAZE_AS, SHOW_ANIMATION} from './_settings.ts'
import {createEgress, denoLog, renderGridPassage} from './_utils.ts'

let mazeGeneratorReturnObject = {
      Algorithm: RENDER_MAZE_AS.BACKTRACKER,
      AnimationDuration: 0,
      Egress:{Enter:[0,0],Exit:[0,0]},
      Grid: { amtColumn: 0, amtRow: 0 },
      Maze: [[0]],
      Type: RENDER_MAZE_AS.PASSAGE,
      Seed: 0,
      SeedVerification: 0
    },
    _ANIMATION_DURATION = 0,
    Maze:number[][]

const huntPtArr:number[][] = [],
      huntEndPtArr:number[][] = [],
      huntPtMap:{[k:string]:number[][]}  = {}

const markEggress = () => {
  const {Enter,Exit} =  mazeGeneratorReturnObject.Egress
  Maze[Enter[0]][Enter[1]] = CELL_STATE.EGGRESS.ENTER
  Maze[Exit[0]][Exit[1]] = CELL_STATE.EGGRESS.EXIT
}

let carvedArray:Array<number[]> = []
const getConsiderations = (pt:number[]):Array<number[]> => {
  const offset = Math.min(_pathAcitve.length,2)
  const surroundingPts = {
    d:[pt[0]+offset,pt[1]],
    l:[pt[0],pt[1]-offset],
    r:[pt[0],pt[1]+offset],
    u:[pt[0]-offset,pt[1]]
  }
  const d = surroundingPts.d[0] < mazeGeneratorReturnObject.Grid.amtRow ? Maze[pt[0]+offset][pt[1]] : null
  const l = surroundingPts.l[1] >= 0 ? Maze[pt[0]][pt[1]-offset] : null
  const r = surroundingPts.r[1] < mazeGeneratorReturnObject.Grid.amtColumn ? Maze[pt[0]][pt[1]+offset] : null
  const u = surroundingPts.u[0] >= 0 ? Maze[pt[0]-offset][pt[1]] : null
  
  const considerArr = []
  d === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.d)
  l === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.l)
  r === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.r)
  u === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.u)

  carvedArray = []
  d === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.d)
  l === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.l)
  r === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.r)
  u === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.u)
  
  return considerArr
}

const carveThrough = (pt:number[],carveTo:number[]) => {
  const carveThroughPt = pt[0] === carveTo[0] 
      ? pt[1] > carveTo[1] ? [pt[0],pt[1]-1] : [pt[0],pt[1]+1]
      : pt[0] > carveTo[0] ? [pt[0]-1,pt[1]] : [pt[0]+1,pt[1]]
      Maze[carveThroughPt[0]][carveThroughPt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
}

const _pathAcitve:Array<number[]> = []
const carveBacktrackMaze = (pt:number[],offset=2) => {
  seedPointer.inc()
  if(offset - 1){ // leave Entrance tile as-is
    Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
  } else { _pathAcitve.push(pt) } // initial path point
  
  const _considerations:number[][] = getConsiderations(pt)
  _considerations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER })

  _ANIMATION_DURATION && renderGridPassage(Maze)
  if(_considerations.length){
    const carveTo = _considerations[seedPointer()%_considerations.length]
    _pathAcitve.push(carveTo) // only push if continuing forward
    if(offset-1) { carveThrough(pt,carveTo) }
  
    setTimeout(()=>{
      _considerations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED })
      Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
      carveBacktrackMaze(_considerations[seedPointer()%_considerations.length])
    },_ANIMATION_DURATION)
  }
  else if (_pathAcitve.length) {
    setTimeout(()=>{
      Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
      if(mazeGeneratorReturnObject.Algorithm === RENDER_MAZE_AS.HUNT_AND_KILL)
      {
        if(!huntEndPtArr.length) {
          const firstRow = Math.max(Math.min(_pathAcitve[0][0],mazeGeneratorReturnObject.Grid.amtRow-2),1),
            firstCol = Math.max(Math.min(_pathAcitve[0][1],mazeGeneratorReturnObject.Grid.amtColumn-2),1)
          huntPtMap[`${firstRow}|${firstCol}`] = getConsiderations([firstRow,firstCol])
          huntPtArr.push([firstRow,firstCol])
        }
        huntEndPtArr.push(pt)

        let hunted = false
        for(let row = 0; row < Maze.length; row++) {
          if(hunted) break
          for(let col = 0; col < Maze[row].length; col++) {
            if(Maze[row][col] === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED) {
              huntPtMap[`${row}|${col}`] = getConsiderations([row,col])
              huntPtArr.push([row,col])
              hunted = true
              break
            }
          }
        }
        if(!hunted)
        { // all top level carving completed
          const hangingPaths:number[][] = []
          const egressPoint = huntPtArr.shift() || [0,0]// handle egress as one off
          const egressConsiderations = huntPtMap[`${egressPoint[0]}|${egressPoint[1]}`]
          carveThrough(egressPoint,egressConsiderations[seedPointer.inc()%egressConsiderations.length])
          
          huntPtArr.forEach(huntd => 
          {
            getConsiderations(huntd)
            let vCString = JSON.stringify(carvedArray)
            huntPtMap[`${huntd[0]}|${huntd[1]}`].forEach(hnt => {
              vCString = vCString.replace(JSON.stringify(hnt), '').replace(',,',',').replace('[,','[').replace(',]',']')
            })
            const _validConsiderations = JSON.parse(vCString)
            if(_validConsiderations.length) carveThrough(huntd,_validConsiderations[seedPointer.inc()%_validConsiderations.length])
            else hangingPaths.push(huntd)
            _ANIMATION_DURATION && renderGridPassage(Maze)
          })
          markEggress() // updates terminal with final frame
          mazeGeneratorReturnObject.Maze = Maze
          _ANIMATION_DURATION && renderGridPassage(Maze)
          denoLog(JSON.stringify(mazeGeneratorReturnObject))
          return
        }
        carveBacktrackMaze(huntPtArr[huntPtArr.length-1])
      } else {
        let bkTrk:number[] = _pathAcitve.pop() || [0,0]
        while (bkTrk[0] === pt[0] && bkTrk[1] === pt[1])
        { bkTrk = _pathAcitve.pop() || [0,0] }
        bkTrk && carveBacktrackMaze(bkTrk)
      }
    },_ANIMATION_DURATION)
  }
  else {
    markEggress() // updates terminal with final frame
    if(_ANIMATION_DURATION) renderGridPassage(Maze)
    mazeGeneratorReturnObject.Maze = Maze
    if (typeof Deno !== 'undefined') console.log(JSON.stringify(mazeGeneratorReturnObject))
  }
}

let _considerations:Array<number[]> = []
const carvePrimMaze = (pt:number[],offset=2) => {
  seedPointer.inc()
  if(offset - 1){ // leave Entrance tile as-is
    Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
    _pathAcitve.length === 1 && _pathAcitve.push(pt) // this line and below are
  } else { _pathAcitve.push(pt) } // needed for getConsiderations method's offset
  
  const _curConsiderations:number[][] = getConsiderations(pt)
  _curConsiderations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER })
  _considerations = [..._curConsiderations, ..._considerations] // _curConsiderations first

  _ANIMATION_DURATION && renderGridPassage(Maze)
  const carveToIndex = carvedArray.length ? seedPointer()%carvedArray.length : seedPointer()%_curConsiderations.length
  const carveTo = carvedArray.length ? carvedArray[carveToIndex] : _considerations.splice(carveToIndex,1)[0]
  if(offset-1) { carveThrough(pt,carveTo) }

  setTimeout(()=>{
    Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    Maze[carveTo[0]][carveTo[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    let carveNext
    if(offset-1) {
      const _considerDenom = 10 /_considerations.length
      carveNext = _considerations.splice(Math.floor(seedPointer()/_considerDenom),1)[0]
    }
    else carveNext = carveTo // handle first case
    if(carveNext) carvePrimMaze(carveNext)
    else {
      markEggress() // updates terminal with final frame
      if(_ANIMATION_DURATION) renderGridPassage(Maze)
      mazeGeneratorReturnObject.Maze = Maze
      if (typeof Deno !== 'undefined') console.log(JSON.stringify(mazeGeneratorReturnObject))
    }
  },_ANIMATION_DURATION)
}

const generateMaze = (_maze:number[][]) => {
  Maze = _maze
  mazeGeneratorReturnObject.Egress = createEgress(mazeGeneratorReturnObject.Algorithm, {Grid:mazeGeneratorReturnObject.Grid, seedPointer})
  markEggress()
  mazeGeneratorReturnObject.Algorithm === RENDER_MAZE_AS.PRIM
    ? carvePrimMaze(mazeGeneratorReturnObject.Egress.Enter,1)
    : carveBacktrackMaze(mazeGeneratorReturnObject.Egress.Enter,1)
}

const instantiate = (base:typeof mazeGeneratorReturnObject) => {
  const { _flatGrid } = (base.Grid as { amtColumn: number, amtRow: number, _flatGrid:number[][]})
  delete (base.Grid as { amtColumn: number, amtRow: number, _flatGrid?:number[][]})._flatGrid
  parseSeed(base.Seed,((base.Grid.amtColumn*base.Grid.amtRow) + base.Grid.amtRow)) // + base.Grid.amtRow is safety buffer
  seedPointer(0)
  seedPointer.inc() // needed to instantiate seed parsing
  mazeGeneratorReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }

  _ANIMATION_DURATION = [mazeGeneratorReturnObject.AnimationDuration?.valueOf(), SHOW_ANIMATION].sort().pop() || 0
  generateMaze(_flatGrid)

}
(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const generatePrimTracker = (base:typeof mazeGeneratorReturnObject) => {
  instantiate(base)
  return mazeGeneratorReturnObject
} // Browser