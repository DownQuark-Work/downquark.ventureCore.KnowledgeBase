export const renderGrid = (Grid:Array<string[]>, _DEBUG = false) => {
  !_DEBUG && console.clear()
  const topBorder = [...Array(Grid[0].length+2).fill('_')],
    bottomBorder = [...Array(Grid[0].length+2).fill('—')]
  console.log(...topBorder)
  Grid.forEach((row: string[]) => {
    const graphics = row.map(i => i === '#' ? '#' : /⊡|^1$/g.test(i) ? '🀫' : ' ')
    const gRow = ['|', ...graphics, '|']
    console.log(...gRow)
  })
  console.log(...bottomBorder)
}

const runGeneratorSubProcess = async () => {
  const p = Deno.run({
    // deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 11))
    cmd: [
      "deno",
      "run",
      "--allow-run",
      "./CellularAutomata/cellular_automata.ts",
      ...Deno.args
      // "./_utils/corridor.ts",
      // `$(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 11))`
    ],
    stdout: "piped",
    stderr: "piped",
  });
console.log('running', p)
  const { code } = await p.status();
console.log('code', code)
  // Reading the outputs closes their pipes
  const rawOutput = await p.output();
  const rawError = await p.stderrOutput();

  if (code === 0) {
    await Deno.stdout.write(rawOutput);
  } else {
    const errorString = new TextDecoder().decode(rawError);
    console.log(errorString);
  }

  Deno.exit(code);
}

// if(Deno.args.length) {
//   console.log('Running subprocess with: ', Deno.args)
//   runGeneratorSubProcess()
// }