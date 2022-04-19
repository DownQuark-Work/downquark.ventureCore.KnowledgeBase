// deno-lint-ignore-file no-explicit-any
import {CELL_STATE} from './_settings.ts'

const _DEBUG = 0

export const proto = () => {
  // Math.clamp = function(num:number, min:number, max:number){ console.log(this); return Math.min(Math.max(num, min), max); }
}

const renderMethods: {[k:string]:any} = {
  corridor: ():string => '#',
  rooms: (i: number, indx: number, opts: { curRm: number; }):string => { if(indx>opts.curRm){curMethod = 'default'} return i === 0 ? ' ' : SPLIT_CHARS[0][indx%26]},
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
let curMethod = 'default'
export const constructGrid = (cols:number,rows:number) => {
  const tmpR =[]
  for(let r=0;r<rows;r++){
    const tmpC = []
    for(let c=0;c<cols;c++){
      tmpC.push(0)
    }
    tmpR.push(tmpC)
  }
  memoGrid = tmpR
}
export const renderGrid = (splitSections:Array<number[]>|Array<number[][]>, useMethod = 'default', opts:{[k:string]:any}={}) => {
  !_DEBUG && console.clear()
  curMethod = useMethod
  if(!memoGrid) { memoGrid = (splitSections as number[][]); return } // initial grid
  if(curMethod === 'corridor')
  { // splitSections is single array of points for corridor
    splitSections.forEach(corridorStep => {
      const cStep = (corridorStep as number[])
      if (memoGrid[cStep[1]][cStep[0]] !== ' ') return
      memoGrid[cStep[1]][cStep[0]] = renderMethods[curMethod]()
    })
    // memoGrid[(splitSections[opts.curCor][0][0] as string)]
    // memoGrid[[opts.curCorridorx]][opts.curCorridor[y]] = renderMethods[curMethod]()
  }
  else
  {
    splitSections.forEach((splits,indx) => {
      splits.forEach((split, i) => {
        const splt = (split as number[])
        for (let y=splt[0]; y<=splt[2]; y++ ) {
          for (let x=splt[1]; x<=splt[3]; x++ ) {
            memoGrid[x][y] = renderMethods[curMethod](i,indx,opts)
          }
        }
      })
    })
  }
  renderBorderedGrid(memoGrid)
  // console.log('curMethod', curMethod)
  // console.log('splitSections', splitSections)
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