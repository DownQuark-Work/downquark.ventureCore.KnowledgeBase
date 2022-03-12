const backtrackerReturnObject = {}

const generateBacktracker = (base:any) => {
  console.log('base', base)
}

(typeof Deno !== 'undefined') && generateBacktracker(Deno.args[0]) // CLI
export const setMazeProps = (base:any) => { generateBacktracker(base) } // Browser