// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313 --prim --anim 225)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 1313 --walled)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 42 --anim)

import {parseSeed, parsedVerifiedValue} from '../../_utils/_seed.ts'
import {CELL_DIRECTIONS_MAP, CELL_STATE, RENDER_MAZE_AS, SHOW_ANIMATION} from './_settings.ts'
import {renderGridPassage} from './_utils.ts'

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
    parsedMazeSeed:number[],
    seedPointer = 0,
    parseedSeedPointer = 0,
    Maze:number[][]
    
const stepUp = () => {
  if(++seedPointer >= parsedMazeSeed.length) seedPointer = 0
  parseedSeedPointer = parsedMazeSeed[seedPointer]
}

const createEgress = () => {
  const colAmt = mazeGeneratorReturnObject.Grid.amtColumn,
        rowAmt = mazeGeneratorReturnObject.Grid.amtRow,
        restraintColAmt = colAmt - Math.floor(colAmt/2.1),
        restraintRowAmt = rowAmt - Math.floor(rowAmt/2.1),
        denomCol = 10 / colAmt,
        denomRow = 10 / rowAmt,
        denomRestraintCol = 10 / restraintColAmt,
        denomRestraintRow = 10 / restraintRowAmt,
        mazeBounds:{[k:string]:number} = {
          BOTTOM: rowAmt-1,
          LEFT: 0,
          RIGHT: colAmt-1,
          TOP: 0,
        }

  while( parseedSeedPointer > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { stepUp() }

  const entWall = CELL_DIRECTIONS_MAP[parseedSeedPointer%4]
  stepUp()
  let entLoc = (entWall.charAt(entWall.length-1) === 'T') ? Math.floor(parseedSeedPointer/denomRow) : Math.floor(parseedSeedPointer/denomCol) // charAt matches LEFT || RIGHT
  if (entLoc%2==0){ entLoc = Math.max(entLoc--,1) } // location must be odd and positive
  stepUp()
  const exWall = CELL_DIRECTIONS_MAP[parseedSeedPointer%4] === entWall ? CELL_DIRECTIONS_MAP[(parseedSeedPointer+1)%4] : CELL_DIRECTIONS_MAP[parseedSeedPointer%4] // ensures not the entrance wall
  stepUp()
  const exitConstraints = (
      exWall.charAt(exWall.length-1) !== entWall.charAt(entWall.length-1) // lefT righT
      && exWall.charAt(1) !== entWall.charAt(1) // tOp bOttom
    )
    ? exWall.charAt(exWall.length-1) === 'T' ? -denomRestraintRow : -denomRestraintCol
    : exWall.charAt(exWall.length-1) === 'T' ? denomRow : denomCol

  let exLoc = (exitConstraints < 0)
    ? Math.floor(parseedSeedPointer/Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt,restraintRowAmt)/2))
    : Math.floor(parseedSeedPointer/exitConstraints)
    if (exLoc%2==0){ Math.max(exLoc--,1) } // location must be odd and positive
    
    const entPt = (entWall.charAt(entWall.length-1) === 'T') ? [entLoc,mazeBounds[entWall]] : [mazeBounds[entWall],entLoc]
    const exPt = (exWall.charAt(exWall.length-1) === 'T') ? [exLoc,mazeBounds[exWall]] : [mazeBounds[exWall],exLoc]
    mazeGeneratorReturnObject.Egress = {Enter:entPt, Exit:exPt}
    Maze[entPt[0]][entPt[1]] = CELL_STATE.EGGRESS.ENTER
    Maze[exPt[0]][exPt[1]] = CELL_STATE.EGGRESS.EXIT
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

const _pathAcitve:Array<number[]> = []
const carveBacktrackMaze = (pt:number[],offset=2) => {
  stepUp()
  if(offset - 1){ // leave Entrance tile as-is
    Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
  } else { _pathAcitve.push(pt) } // initial path point
  
  const _considerations:number[][] = getConsiderations(pt)
  _considerations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER })

  _ANIMATION_DURATION && renderGridPassage(Maze)
  if(_considerations.length){
    const carveTo = _considerations[parseedSeedPointer%_considerations.length]
    _pathAcitve.push(carveTo) // only push if continuing forward
    if(offset-1) {
      const carveThroughPt = pt[0] === carveTo[0] 
      ? pt[1] > carveTo[1] ? [pt[0],pt[1]-1] : [pt[0],pt[1]+1]
      : pt[0] > carveTo[0] ? [pt[0]-1,pt[1]] : [pt[0]+1,pt[1]]
      Maze[carveThroughPt[0]][carveThroughPt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    }
  
    setTimeout(()=>{
      _considerations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED })
      Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
      _ANIMATION_DURATION && console.clear()
      carveBacktrackMaze(_considerations[parseedSeedPointer%_considerations.length])
    },_ANIMATION_DURATION)
  }
  else if (_pathAcitve.length) {
    setTimeout(()=>{
      Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
      let bkTrk:number[] = _pathAcitve.pop() || [0,0]
      while (bkTrk[0] === pt[0] && bkTrk[1] === pt[1])
      { bkTrk = _pathAcitve.pop() || [0,0] }
      _ANIMATION_DURATION && console.clear()
      bkTrk && carveBacktrackMaze(bkTrk)
    },_ANIMATION_DURATION)
  }
  else {
    mazeGeneratorReturnObject.Maze = Maze
    console.log(JSON.stringify(mazeGeneratorReturnObject))
  }
}

const generateBacktracker = (_maze:number[][]) => {
  Maze = _maze
  createEgress()
  carveBacktrackMaze(mazeGeneratorReturnObject.Egress.Enter,1) // Walk the path - Do the thing
}

let _considerations:Array<number[]> = []
const carvePrimMaze = (pt:number[],offset=2) => {
  stepUp()
  if(offset - 1){ // leave Entrance tile as-is
    Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
    _pathAcitve.length === 1 && _pathAcitve.push(pt) // this line and below are
  } else { _pathAcitve.push(pt) } // needed for getConsiderations method's offset
  
  const _curConsiderations:number[][] = getConsiderations(pt)
  _curConsiderations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER })
  _considerations = [..._curConsiderations, ..._considerations] // _curConsiderations first

  _ANIMATION_DURATION && renderGridPassage(Maze)
  const carveToIndex = carvedArray.length ? parseedSeedPointer%carvedArray.length : parseedSeedPointer%_curConsiderations.length
  const carveTo = carvedArray.length ? carvedArray[carveToIndex] : _considerations.splice(carveToIndex,1)[0]
  if(offset-1) {
    const carveThroughPt = pt[0] === carveTo[0] 
    ? pt[1] > carveTo[1] ? [pt[0],pt[1]-1] : [pt[0],pt[1]+1]
    : pt[0] > carveTo[0] ? [pt[0]-1,pt[1]] : [pt[0]+1,pt[1]]
    Maze[carveThroughPt[0]][carveThroughPt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
  }

  setTimeout(()=>{
    Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    Maze[carveTo[0]][carveTo[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    _ANIMATION_DURATION && console.clear()
    let carveNext
    if(offset-1) {
    const _considerDenom = 10 /_considerations.length
    carveNext = _considerations.splice(Math.floor(parseedSeedPointer/_considerDenom),1)[0]
    }
    else carveNext = carveTo // handle first case
    if(carveNext) carvePrimMaze(carveNext)
    else {
      _ANIMATION_DURATION && console.clear()
      _ANIMATION_DURATION && renderGridPassage(Maze)
      mazeGeneratorReturnObject.Maze = Maze
      console.log(JSON.stringify(mazeGeneratorReturnObject))
    }
  },_ANIMATION_DURATION)
}
const generatePrim = (_maze:number[][]) => {
  Maze = _maze
  createEgress()
  carvePrimMaze(mazeGeneratorReturnObject.Egress.Enter,1) // Walk the path - Do the thing
}

const instantiate = (base:any) => {
  seedPointer = 0
  const { _flatGrid } = base.Grid
  delete base.Grid._flatGrid
  const strParsedSeed = parseSeed(base.Seed,((base.Grid.amtColumn*base.Grid.amtRow) + base.Grid.amtRow)) // + base.Grid.amtRow is safety buffer
  parsedMazeSeed = strParsedSeed.map(str => parseInt(str,10))
  stepUp() // needed to instantiate seed parsing
  mazeGeneratorReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }
  _ANIMATION_DURATION = [mazeGeneratorReturnObject.AnimationDuration?.valueOf(), SHOW_ANIMATION].sort().pop() || 0
  
  mazeGeneratorReturnObject.Algorithm === RENDER_MAZE_AS.PRIM
    ? generatePrim(_flatGrid)
    : generateBacktracker(_flatGrid)
}

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const setMazeProps = (base:any) => { instantiate(base) } // Browser