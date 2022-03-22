import {setMazeProps, generatePrimTracker, generateSidewinder}  from '../../_modules/_deno.ts'

export const generateMaze:(x:{gw:number,gh:number,seedArg?:number, mazeType?:string, algorithm?:string}, cb?:()=>void) => void = ({gw, gh, seedArg, mazeType, algorithm}, cb = ()=>{}) => {
  const mazeBase:any = setMazeProps(gh,gw, seedArg, algorithm, mazeType)
  const generatedMaze = (algorithm === 'RENDER_MAZE.WITH_SIDEWINDER')
    ? generateSidewinder(mazeBase)
    : generatePrimTracker(mazeBase)
  return generatedMaze
}