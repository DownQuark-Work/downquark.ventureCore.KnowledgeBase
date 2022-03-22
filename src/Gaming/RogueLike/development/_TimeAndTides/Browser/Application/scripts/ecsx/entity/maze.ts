import {setMazeProps, generatePrimTracker, generateSidewinder}  from '../../_modules/_deno.ts'

export const generateMaze:(x:{gw:number,gh:number,seedArg?:number, mazeType?:string, algorithm?:string}, cb?:()=>void) => void = ({gw, gh, seedArg, mazeType, algorithm}, cb = ()=>{}) => {
  console.log('{setMazeProps, generatePrimTracker, generateSidewinder}', {setMazeProps, generatePrimTracker, generateSidewinder})
  const mazeBase:any = setMazeProps(gw,gh, seedArg, algorithm, mazeType)
  console.log('-> setMazeProps(gw,gh)', mazeBase)
  if (algorithm === 'RENDER_MAZE.WITH_SIDEWINDER') { console.log('generateSidewinder', generateSidewinder(mazeBase)) }
  else { console.log('generatePrimTracker', generatePrimTracker(mazeBase)) }
}