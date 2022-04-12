// deno-lint-ignore-file no-explicit-any
import {CELL_STATE} from './_settings.ts'

const _DEBUG = 0

export const proto = () => {
  // Math.clamp = function(num:number, min:number, max:number){ console.log(this); return Math.min(Math.max(num, min), max); }
}

const renderMethod: {[k:string]:any} = {
  rooms: (i: number,indx: number):string => i === 0 ? ' ' : SPLIT_CHARS[i][indx%26],
  default: (i: number,indx: number):string => SPLIT_CHARS[i][indx%26]
}

export const denoLog = (...logVal:any[]) => {
  if (typeof Deno !== 'undefined') console.log(...logVal)
}
const SPLIT_CHARS = [
  ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
]

let memoGrid:Array<Array<number|string>>
export const renderGrid = (splitSections:Array<number[]>|Array<number[][]>, renderRooms = false) => {
  !_DEBUG && console.clear()
  const rndrMthd:string = renderRooms ?  'rooms' : 'default'
  if(!memoGrid) { memoGrid = (splitSections as number[][]); return } // initial grid
  splitSections.forEach((splits,indx) => {
    splits.forEach((split, i) => {
      const splt = (split as number[])
      // console.log(indx, SPLIT_CHARS[i][indx], 'split', splt,i)
      for (let y=splt[0]; y<=splt[2]; y++ ) {
        for (let x=splt[1]; x<=splt[3]; x++ ) {
          memoGrid[x][y] = renderMethod[rndrMthd](i,indx)
          // console.log('SPLIT_CHARS[i][indx]', SPLIT_CHARS[i][indx])
        }
      }
    })
  })
  renderBorderedGrid(memoGrid)
  console.log('splitSections', splitSections)
}

export const renderBorderedGrid = (Grid:(number|string)[][]) => {
  const topBorder:'_'[] = [...Array(Grid[0].length+2).fill('_')],
    bottomBorder:'-'[] = [...Array(Grid[0].length+2).fill('—')]
    console.log(...topBorder)
  Grid.forEach((row: (number|string)[]) => {
    const borderedRow = ['|', ...row, '|']
    console.log(...borderedRow) 
  })
  console.log(...bottomBorder)
}