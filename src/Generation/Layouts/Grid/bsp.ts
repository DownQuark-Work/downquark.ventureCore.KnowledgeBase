// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 13 -c 13 -s 1313)
// deno run Layouts/Grid/bsp.ts $(deno run Layouts/Grid/_base.ts -r 20 -c 25 -s 1313)

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {renderGrid} from './_utils.ts'
import {DIVISION_CONSTRAINTS, WOBBLE_RANGE} from './_settings.ts'

const Divisions:any = []
let gridReturnObj = {
  AnimationDuration: 0,
  Dimension: { columns: 0, rows: 0 },
  Grid: [[0]],
  Seed: 0,
  SeedVerification: 0
}
  let genDiv = 0
  const generateDivisions = () => {
     // [START_COL, START_ROW, END_COL, END_ROW]
    const curDivisions = Divisions[Divisions.length-1]
    console.log('Divs',Divisions)
    console.log('curD',curDivisions)
    let newDivisions:Array<number[]> = []
    curDivisions.forEach((division: number[]) => {
      // const newDivisions:Array<number[][]> = tmpDivisions.map((division: number[]) => {
      const splitAlpha = [division[0],division[1]] // TOP LEFT
      const splitBeta = [division[2],division[3]] // BOTTOM RIGHT
      const splitDir = seedPointer() % 2 === 0 ? 0 : 1 // ? FOLD DOWN : FOLD ACROSS
      const splitVals = {
        midpoint: [
          (division[3] - division[1])/2, // vert midpoint
          (division[2] - division[0])/2, // horiz  midpoint
        ],
        horiz: [division[0], division[2]],
        vert: [division[1], division[3]],
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
        console.log('applyCurrentWobble', applyCurrentWobble.toFixed(3), divideAt)
        console.log('divideAt WORKS::', divideAt)

        return divideAt // DIVISION_CONSTRAINTS.ROOMS
      }

      splitVals.dividedAt = createDivide()

      if(splitDir)
        { // FOLD ACROSS
          splitAlpha.push(splitVals.dividedAt-1,division[3])
          splitBeta.unshift(splitVals.dividedAt,division[1])
        } else { // FOLD DOWN
          splitAlpha.push(division[2],splitVals.dividedAt)
          splitBeta.unshift(division[0],splitVals.dividedAt+1)
        }
        console.log('sAB',Divisions.length,' - ', splitAlpha, splitBeta)
        newDivisions.push(splitAlpha, splitBeta)
        console.log('newDivisions', newDivisions)
      // console.log('splitVals', splitVals)
      // console.log('division', division)
      // console.log('splitAlpha, splitBeta', splitAlpha, splitBeta)
      return [splitAlpha, splitBeta]
    })
    const pushDivisions = [...newDivisions]
    console.log('newDivisions', pushDivisions)

    // console.log('DIVISION_CONSTRAINTSs', DIVISION_CONSTRAINTS)
    // Divisions.push(...newDivisions)
    console.log('newDivisionsXXX', newDivisions)
    Divisions.push(newDivisions)
    // Divisions.push(pushDivisions)
    
    console.log('Divisions', Divisions)
    console.log('=============');
    console.log('=============');
    newDivisions = [[]]
    
    // const splitH = () => { }
    // const splitDir = seedPointer() % 2 === 0 ? '-' : '|'
    // seedPointer.inc()
    // console.log('splitDir', splitDir)

    // console.log('seedPointer()1', seedPointer())
    // console.log('seedPointer()2', seedPointer())
    if(genDiv++ < 3) setTimeout(generateDivisions,1000)
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
    Divisions.push([[0,0,base.Dimension.columns-1,base.Dimension.rows-1]]) // [START_COL, START_ROW, END_COL, END_ROW]
    generateDivisions()
    // setTimeout(generateDivisions, 3000)
    // setTimeout(generateDivisions, 7000)

    // renderGrid(base.Grid)
    // console.log('BSP:', base.Dimension.columns*base.Dimension.rows,base.Dimension.columns*base.Dimension.columns,base.Seed)
    // console.log('gridReturnObj', gridReturnObj)
  }

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const generateSidewinder = (base:typeof gridReturnObj) => {
  instantiate(base)
  return gridReturnObj
} // Browser