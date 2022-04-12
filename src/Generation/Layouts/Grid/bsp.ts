// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1342)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1313)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 134269 --anim 1000) # SETTINGS -> ROOMS: 50

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {renderGrid} from './_utils.ts'
import {DIVISION_CONSTRAINTS, WOBBLE_RANGE, START_COL, START_ROW, END_COL, END_ROW} from './_settings.ts'

const Divisions:any = []
let gridReturnObj = {
    AnimationDuration: 0,
    Dimension: { columns: 0, rows: 0 },
    Grid: [[0]],
    Seed: 0,
    SeedVerification: 0
  }

  const renderCorridors = () => {
    // walk backwards through Divisions and _only_ if there is an associated split do we draw the corridor
    // no split means corridor will be drawn closer to the 0 index
    // TODO(@mlnck): incorporate random walk path
    // TODO(@mlnck): - with and without dead ends
  }
  const renderRooms = () => {
    console.log('Use Divisions[Divisions.length-1] to create and position rooms which will fit in each section')
    const roomMinBorder = 1 * 2 // 1 for top,bottom,left,right //*2 for top&bot, left&right
    const roomMin = DIVISION_CONSTRAINTS.WALL_LENGTH
    const roomsLayout:number[][] = []
    Divisions[Divisions.length-1].forEach((gridArea:number[][]): void => {
      console.log('gridArea', gridArea)
      gridArea.forEach((gA) => {
        console.log('gA', gA)
        const roomRangeCols = gA[END_COL] - gA[START_COL] - roomMin
        const roomRangeRows = gA[END_ROW] - gA[START_ROW] - roomMin
        console.log('roomMaxCols, roomMaxRows, roomMin', roomRangeRows, roomRangeCols)
        // console.log('seedPointer.inc()', seedPointer.inc())
        const roomDims = [Math.floor((roomRangeCols/9)*seedPointer.inc()+roomMin-roomMinBorder), Math.floor((roomRangeRows/9)*seedPointer.inc()+roomMin-roomMinBorder)]
        const availableOffsetCols = roomRangeCols - roomDims[0] + roomMin - roomMinBorder
        const availableOffsetRows = roomRangeRows - roomDims[1] + roomMin - roomMinBorder
        console.log('roomDims', roomDims, roomRangeCols + 2, roomRangeRows + 2)
        console.log('availableOffsetCols, availableOffsetRows', availableOffsetCols, availableOffsetRows)
        const roomDataInitCol = gA[START_COL]+Math.floor((availableOffsetCols/9)*seedPointer.inc())
        const roomDataInitRow = gA[START_ROW]+Math.floor((availableOffsetRows/9)*seedPointer.inc())
        const roomData = [
          roomDataInitCol,
          roomDataInitRow,
          roomDataInitCol+roomDims[0],
          roomDataInitRow+roomDims[1],
        ]
        roomsLayout.push(roomData)
      })
      }
    )
    console.log('roomsLayout', roomsLayout)
    false && renderCorridors()
  }

  const generateDivisions = () => {
    let continueGenerate = false
    let totalRooms = 0
     // [START_COL, START_ROW, END_COL, END_ROW]
    const curDivisions = Divisions[Divisions.length-1]
    // console.log('Divs',Divisions)
    // console.log('curD',curDivisions)
    let newDivisions:Array<number[][]>|null = null
    curDivisions.forEach((divisions: number[][]) => { // all divisions at level
      divisions.forEach((division: number[]) => { // paired split
      const splitAlpha = [division[START_COL],division[START_ROW]] // TOP LEFT
      const splitBeta = [division[END_COL],division[END_ROW]] // BOTTOM RIGHT
      const splitDir = seedPointer() % 2 === 0 ? 0 : 1 // ? FOLD DOWN : FOLD ACROSS
      const splitVals = {
        midpoint: [
          (division[END_ROW] - division[START_ROW])/2, // vert midpoint
          (division[END_COL] - division[START_COL])/2, // horiz  midpoint
        ],
        horiz: [division[0], division[END_COL]],
        vert: [division[START_ROW], division[END_ROW]],
        dividedAt: -1,
      }

      const createDivide = (curDivisions:Array<number[]> = []) => {
        const wAmtRange = WOBBLE_RANGE[1]-WOBBLE_RANGE[0]
        const wobbleStep = wAmtRange/DIVISION_CONSTRAINTS.ROOMS
        const wobbleRooms = curDivisions.length
        const currentWobbleAmt = Math.min(Math.max(WOBBLE_RANGE[1] - (wobbleStep*wobbleRooms), WOBBLE_RANGE[0]), WOBBLE_RANGE[1])
        const currentWobbleAmtStep = currentWobbleAmt/9

        const applyCurrentWobble = seedPointer.inc() % 2 === 0 ? currentWobbleAmtStep * seedPointer() : -(currentWobbleAmtStep * seedPointer())
        const divideAt = Math.floor(splitVals.midpoint[splitDir] + splitVals.midpoint[splitDir] * applyCurrentWobble)
        // console.log('applyCurrentWobble, divideAt', applyCurrentWobble.toFixed(3), divideAt, splitVals.midpoint[splitDir])

        return divideAt // DIVISION_CONSTRAINTS.ROOMS
      }

      splitVals.dividedAt = createDivide()

      // console.log('splitVals.dividedAt, splitDir', splitVals.dividedAt, splitDir)
      if(splitDir)
        { // FOLD ACROSS
          splitAlpha.push(division[START_COL]+splitVals.dividedAt,division[END_ROW])
          splitBeta.unshift(division[START_COL]+splitVals.dividedAt+1,division[START_ROW])
        } else { // FOLD DOWN
          splitAlpha.push(division[2],division[START_ROW]+splitVals.dividedAt)
          splitBeta.unshift(division[START_COL],division[START_ROW]+splitVals.dividedAt+1)
        }
        console.log('sAB',Divisions.length,' - ', splitAlpha, splitBeta)

        if(!newDivisions) newDivisions = []
        const shortWall = Math.min(
          splitAlpha[END_COL] - splitAlpha[START_COL],
          splitAlpha[END_ROW] - splitAlpha[START_ROW],
          splitBeta[END_COL] - splitBeta[START_COL],
          splitBeta[END_ROW] - splitBeta[START_ROW],
        )
        // console.log('shortWall, DIVISION_CONSTRAINTS_WALL_LENGTH', shortWall, DIVISION_CONSTRAINTS.WALL_LENGTH)
        if(shortWall < DIVISION_CONSTRAINTS.WALL_LENGTH)
        {
          newDivisions.push([division])
          totalRooms += 1
        }
        else {
          newDivisions.push([splitAlpha, splitBeta])
          totalRooms += 2
          continueGenerate = true
        }
    })
  })

  Divisions.push(newDivisions)

    console.log('Divisions', Divisions)
    console.log('=============');
    console.log('=============');
    newDivisions = null

    gridReturnObj.AnimationDuration && renderGrid(Divisions[Divisions.length-1])
    console.log('totalRooms', totalRooms)
    if(totalRooms >= DIVISION_CONSTRAINTS.ROOMS) {
      continueGenerate = false
      console.log('DIVISION_CONSTRAINTS.ROOMS: ', DIVISION_CONSTRAINTS.ROOMS, ' Rooms: ', totalRooms); 
      // return
    }
    if(continueGenerate) setTimeout(generateDivisions,gridReturnObj.AnimationDuration)
    else { renderRooms() }
  }

  const instantiate = (base:typeof gridReturnObj) => {
    console.log('Deno.args[0]', Deno.args)
    seedPointer(0)
    parseSeed(base.Seed,((base.Dimension.columns*base.Dimension.rows) + base.Dimension.rows)) // + base.Dimension.column is safety buffer
    seedPointer.inc() // needed to instantiate seed parsing
    gridReturnObj = {
      ...base,
      SeedVerification: parsedVerifiedValue()
    }
    Divisions.push([[[0,0,base.Dimension.columns-1,base.Dimension.rows-1]]]) // [START_COL, START_ROW, END_COL, END_ROW]
    gridReturnObj.AnimationDuration && renderGrid(base.Grid)
    generateDivisions()

    // renderGrid(base.Grid, true)
    // console.log('gridReturnObj', gridReturnObj)
  }

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const generateSidewinder = (base:typeof gridReturnObj) => {
  instantiate(base)
  return gridReturnObj
} // Browser