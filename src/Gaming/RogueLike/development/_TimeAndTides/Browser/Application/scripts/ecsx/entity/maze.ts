import {MazeSettings, setMazeProps, generatePrimTracker, generateSidewinder}  from '../../_modules/_deno.ts'

const madeMazes:string[] = []
export const generateMaze:(x:{gw:number,gh:number,seedArg?:number, mazeType?:string, algorithm?:string}, cb?:()=>void) => void = async ({gw, gh, seedArg, mazeType, algorithm}, cb = ()=>{}) => {
  const mazeBase:any = setMazeProps(gw, gh, seedArg, algorithm, mazeType)
  let generatedMaze:any|null = (algorithm === 'RENDER_MAZE.WITH_SIDEWINDER')
    ? generateSidewinder(mazeBase)
    : generatePrimTracker(mazeBase)

    while (!generatedMaze.Maze) await new Promise((resolve) => { setTimeout(() => { resolve(1); }, 600); });
  
  const mazeMap = document.getElementById('game')
  let mazeString = ''
  mazeMap && generatedMaze.Maze.forEach((row: number[],indx:number) => {
    row.forEach((i,idx) => {
      mazeString += `<span data-point="${idx}|${indx}" data-point-type="`
      switch (i) {
        case MazeSettings.CELL_STATE['RENDER_MAZE_AS.PASSAGE'].IN_PATH:
          mazeString += 'on">'
          break
        case MazeSettings.CELL_STATE.EGGRESS.ENTER:
          mazeString += 'on" data-point-variant="water">'
          break
        case MazeSettings.CELL_STATE.EGGRESS.EXIT:
          mazeString += 'off" data-point-variant="water">'
          break
        default :
          mazeString += 'off">'
      }
      mazeString += '&nbsp;</span>'
    })
    mazeString += '<br />'
  })

  if (mazeMap) mazeMap.innerHTML = mazeString

  mazeString = ''
  generatedMaze = null
  cb && cb()
}
