// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1342)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1313)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 134269 --anim 1000) # SETTINGS -> ROOMS: 50
//  deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 696913134242 --anim 500) -> ROOMS:13 
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 35 -c 60 -s 6969131 --anim 500) <- fun!

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {denoLog, constructGrid, renderGrid} from './_utils.ts'
import {CELL_STATE, DIVISION_CONSTRAINTS, WOBBLE_RANGE, START_COL, START_ROW, END_COL, END_ROW} from './_settings.ts'

const Divisions:any = []
let gridReturnObj = {
    AnimationDuration: 0,
    Dimension: { columns: 0, rows: 0 },
    Grid: [[0]],
    Seed: 0,
    SeedVerification: 0
  }

  const configureReturnObjGrid = (corridorPaths:number[][][]) => {
    if (!corridorPaths) return // not yet completed
    roomsLayout.forEach(room => {
      for(let col = room[START_COL]; col <= room[END_COL]; col++)
      { for(let row = room[START_ROW]; row <= room[END_ROW]; row++)
        { gridReturnObj.Grid[row][col] = CELL_STATE.COMMON.CREATED } }
    })
    
    corridorPaths.forEach(cPath => {
      cPath.forEach(cStep => {
        if(gridReturnObj.Grid[cStep[1]][cStep[0]] === CELL_STATE.COMMON.NON_CONSIDERED)
        { gridReturnObj.Grid[cStep[1]][cStep[0]] = CELL_STATE.CORRIDOR.IN_PATH }
      })
    })

    !gridReturnObj.AnimationDuration && denoLog(JSON.stringify(gridReturnObj))
  }

  const createAnchors = (spans:number[][]) => {
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

    return [spanRangeStart, spanRangeEnd]
  }

  const constructCorridors = (corridors:number[][][]) => {
    const corRoute = (pts:number[][], colFirst=0) => {
      const [s,e] = pts,
            rte = [s],
            dirCol = (e[0]-s[0]) / Math.abs(e[0]-s[0]) || 0,
            dirRow = (e[1]-s[1]) / Math.abs(e[1]-s[1]) || 0

      const rteCols = [...Array(Math.abs(e[0]-s[0])).keys()].map(k => [((k+1)*dirCol) + s[0], colFirst ? s[1] : e[1]])
      const rteRows = [...Array(Math.abs(e[1]-s[1])).keys()].map(k => [colFirst ? e[0] : s[0], ((k+1)*dirRow) + s[1]])
      
      if(colFirst) rte.push(...rteCols, ...rteRows)
      else rte.push(...rteRows, ...rteCols)
      return rte
    }

    const corridorPaths = corridors.map(corridor => {
      const sePts = [[...corridor[seedPointer.inc()%2]], [...corridor[Math.abs(seedPointer()%2-1)]]]
      return corRoute(sePts,seedPointer()%2)
    })

    configureReturnObjGrid(corridorPaths)

    const corridorAnim = async () => {
      let curCor = 0
      while (curCor < corridorPaths.length) {
        await new Promise((resolve) => {
          setTimeout(() => {
            renderGrid(corridorPaths[curCor], 'corridor', {curCor})
            curCor++
            resolve(1)
          }, gridReturnObj.AnimationDuration)
        })
      }
    }
    gridReturnObj.AnimationDuration && corridorAnim()
  }

  const determineCorridors = () => {
    // console.log('render corridor')
    // console.log('roomsLayout', roomsLayout)
    // console.log('renderArrayRoomsLayout', renderArrayRoomsLayout)
    // console.log('Divisions', Divisions)
    const roomLayoutGridMap:{[k:string]:number[]} = {}
    Object.entries(renderArrayRoomsLayout).forEach(rmLayout => {
      roomLayoutGridMap[rmLayout[1][0].join('x')] = rmLayout[1][1]
    })

    const collapseDivision = (span:string, val:number[]) => {
      // associates rooms to keys which have been split and therefor are no longer valid
      const k = [span[0][0], span[0][1], span[1][2], span[1][3]].join('x')
      roomLayoutGridMap[k] = val
    }
    // walk backwards through Divisions and _only_ if there is an associated split do we draw the corridor
    const corridors = []
    for(let depth = Divisions.length-1; depth >= 0; depth--) {
      const levelCorridors = []
      for(let span = Divisions[depth].length-1; span >= 0; span--) {
        if(Divisions[depth][span].length > 1) {
          const gridMapKey = [Divisions[depth][span][0].join('x'), Divisions[depth][span][1].join('x')]
          const bridgeSpan = [roomLayoutGridMap[gridMapKey[0]], roomLayoutGridMap[gridMapKey[1]]]
          levelCorridors.unshift(createAnchors( bridgeSpan ))
          collapseDivision(Divisions[depth][span],bridgeSpan[seedPointer.inc()%2])
        }
      }
      corridors.push(...levelCorridors)
    }
    constructCorridors(corridors)

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
        determineCorridors()
      }
      roomAnim()
    } else determineCorridors()
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
    newDivisions = null

    gridReturnObj.AnimationDuration && renderGrid(Divisions[Divisions.length-1])
    if(totalRooms >= DIVISION_CONSTRAINTS.ROOMS) continueGenerate = false
    if(continueGenerate) setTimeout(generateDivisions,gridReturnObj.AnimationDuration)
    else { renderRooms() }
  }

  const instantiate = (base:typeof gridReturnObj) => {
    seedPointer(0)
    parseSeed(base.Seed,((base.Dimension.columns*base.Dimension.rows) + base.Dimension.rows)) // + base.Dimension.column is safety buffer
    seedPointer.inc() // needed to instantiate seed parsing
    gridReturnObj = {
      ...base,
      SeedVerification: parsedVerifiedValue()
    }
    Divisions.push([[[0,0,base.Dimension.columns-1,base.Dimension.rows-1]]]) // [START_COL, START_ROW, END_COL, END_ROW]
    gridReturnObj.AnimationDuration && constructGrid(base.Dimension.columns, base.Dimension.rows)
    generateDivisions()

    // renderGrid(base.Grid, true)
    // console.log('gridReturnObj', gridReturnObj)
  }

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const generateSidewinder = (base:typeof gridReturnObj) => {
  instantiate(base)
  return gridReturnObj
} // Browser