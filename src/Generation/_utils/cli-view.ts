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