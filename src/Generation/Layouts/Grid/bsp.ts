// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1342)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1313)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 134269 --anim 1000) # SETTINGS -> ROOMS: 50
//  deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 696913134242 --anim 500) -> ROOMS:13 

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

  const createAnchors = (spans:number[][]) => {
    console.log('spans', spans)
    let curSpan = 0
    const createAnchorPoint = () => {
      const colPos = Math.floor(((spans[curSpan][END_COL] - spans[curSpan][START_COL])/9)*seedPointer.inc())
      const rowPos = Math.floor(((spans[curSpan][END_ROW] - spans[curSpan][START_ROW])/9)*seedPointer.inc())
      const anchors = [
        spans[curSpan][START_COL]+colPos,
        spans[curSpan][START_ROW]+rowPos
      ]
      curSpan++
      return anchors
    }
    const spanRangeStart = createAnchorPoint()
    const spanRangeEnd = createAnchorPoint()
    // console.log('rnge', spanRangeStart, spanRangeEnd)
    //s = gA[END_COL] - gA[START_COL] - roomMin
    
    // console.log('startPt,endPt', startPt,endPt)
    return [spanRangeStart, spanRangeEnd]
  }

  const renderCorridors = () => {
    console.log('render corridor')
    console.log('roomsLayout', roomsLayout)
    console.log('renderArrayRoomsLayout', renderArrayRoomsLayout)
    console.log('Divisions', Divisions)

    const roomLayoutGridMap:{[k:string]:number[]} = {}
    Object.entries(renderArrayRoomsLayout).forEach(rmLayout => {
      console.log('rmLayout', rmLayout)
      roomLayoutGridMap[rmLayout[1][0].join('x')] = rmLayout[1][1]
      // roomLayoutGridMap[(rmLayout[0] as unknown as number[]).join('')] = (rmLayout[1] as unknown as number[])
    })
    console.log('roomLayoutGridMap', roomLayoutGridMap)
    // console.log('roomLayoutGridMap[0x0x23x34', roomLayoutGridMap['0x0x23x34'])
    // if 2 TOPLEFT corners are equal then Horizontal bridge : Vertical

    // walk backwards through Divisions and _only_ if there is an associated split do we draw the corridor
    const corridors = []
    // for(let depth = Divisions.length-1; depth >= 0; depth--) {
    for(let depth = Divisions.length-1; depth >= Divisions.length-1; depth--) {
      const levelCorridors = []
      // console.log('depth', depth)
      for(let span = Divisions[depth].length-1; span >= 0; span--) {
        // console.log('span', span, Divisions[depth][span].length)
        if(Divisions[depth][span].length > 1) {
          // Upon completion fo this step - the matched values should collapse and obtain a value for the state object.
            // the key would be made by: [Divisions[depth][span][0][0], Divisions[depth][span][0][1], Divisions[depth][span][1][2], Divisions[depth][span][1][3]]
            console.log('[Divisions[depth][span][0][0], Divisions[depth][span][0][1], Divisions[depth][span][1][0], Divisions[depth][span][1][2]], Divisions[depth][span][1][2]]', [Divisions[depth][span][0][0], Divisions[depth][span][0][1], Divisions[depth][span][1][2], Divisions[depth][span][1][3]])
            console.log('randomly select one of the 2 rooms from the split to associate with the new key')
            console.log('do this recursively until depth 0')
            console.log('that should resolve the order of linking to the rooms')
            
          const gridMapKey = [Divisions[depth][span][0].join('x'), Divisions[depth][span][1].join('x')]
          console.log('gridMapKey', gridMapKey)
          const bridgeSpan = [roomLayoutGridMap[gridMapKey[0]], roomLayoutGridMap[gridMapKey[1]]]
          console.log('bridgeSpan', bridgeSpan)
          levelCorridors.unshift(createAnchors( bridgeSpan ))
          // levelCorridors.unshift(createAnchors( Divisions[depth][span] ))
          // TODO@mlnck: sorting and filtering
        }
      }
      corridors.push(levelCorridors)
    }
    console.log('corridors', corridors)

    // no split means corridor will be drawn closer to the 0 index
    // TODO(@mlnck): incorporate random walk path
    // TODO(@mlnck): - with and without dead ends
  }
  const roomsLayout:number[][] = []
  const renderArrayRoomsLayout:number[][][] = []
  const renderRooms = () => {
    const roomMinBorder = 1 * 2 // 1 for top,bottom,left,right //*2 for top&bot, left&right
    const roomMin = DIVISION_CONSTRAINTS.WALL_LENGTH
    Divisions[Divisions.length-1].forEach((gridArea:number[][]): void => {
      gridArea.forEach((gA) => {
        const roomRangeCols = gA[END_COL] - gA[START_COL] - roomMin
        const roomRangeRows = gA[END_ROW] - gA[START_ROW] - roomMin

        const roomDims = [Math.floor((roomRangeCols/9)*seedPointer.inc()+roomMin-roomMinBorder), Math.floor((roomRangeRows/9)*seedPointer.inc()+roomMin-roomMinBorder)]
        const availableOffsetCols = roomRangeCols - roomDims[0] + roomMin - roomMinBorder
        const availableOffsetRows = roomRangeRows - roomDims[1] + roomMin - roomMinBorder

        const roomDataInitCol = gA[START_COL]+Math.floor((availableOffsetCols/9)*seedPointer.inc())
        const roomDataInitRow = gA[START_ROW]+Math.floor((availableOffsetRows/9)*seedPointer.inc())
        const roomData = [
          roomDataInitCol,
          roomDataInitRow,
          roomDataInitCol+roomDims[0],
          roomDataInitRow+roomDims[1],
        ]
        roomsLayout.push(roomData)
        renderArrayRoomsLayout.push([gA, roomData])
      })
      }
    )
    if(gridReturnObj.AnimationDuration) {
      const roomRenderArr = [...Divisions[Divisions.length-1]]
      const roomAnim = async () => {
        let curRm = 0
        while (curRm < renderArrayRoomsLayout.length) {
          roomRenderArr[curRm] = renderArrayRoomsLayout[curRm]
          await new Promise((resolve) => {
            setTimeout(() => {
              renderGrid(roomRenderArr, 'rooms', {curRm})
              curRm++
              resolve(1)
            }, gridReturnObj.AnimationDuration)
          })
        }
        console.log('shown Rooms', curRm)
        renderCorridors()
      }
      roomAnim()
    } else renderCorridors()

    // console.log('roomsLayout', roomsLayout)
    // console.log('renderArrayRoomsLayout', renderArrayRoomsLayout)
    // false && renderCorridors()
  }

  const generateDivisions = () => {
    let continueGenerate = false
    let totalRooms = 0
     // [START_COL, START_ROW, END_COL, END_ROW]
    const curDivisions = Divisions[Divisions.length-1]
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

        return divideAt // DIVISION_CONSTRAINTS.ROOMS
      }

      splitVals.dividedAt = createDivide()

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