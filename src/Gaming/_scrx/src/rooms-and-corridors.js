const dqCanvas = document.getElementById("downquark-canvas")
let dqCanvasCntxt

function updateDomBaseGrid() {
  const valCol = document.querySelector('input[name="cols"]').value
  const valRow = document.querySelector('input[name="rows"]').value
  const valType = document.querySelector('input[name="grid-type"]:checked').value
  valType === 'carved'
    ? dqCanvas.CarvedGrid(valCol,valRow)
    : dqCanvas.Grid(valCol,valRow)
  dqCanvasCntxt = dqCanvas.RenderBaseContext()
  document.getElementById('render-base-grid').setAttribute('style','pointer-events:none; opacity:.3')
  document.getElementById('with-canvas-context').removeAttribute('style')
}

function getGridPosition() {
  const gridPos = document.querySelector('input[name="grid-position-value"]').value.split(',')
  const dqp = (!gridPos[0].length)
    ? 'enter an index or point'
    : dqCanvas.Position(parseInt(gridPos[0],10),parseInt(gridPos[1],10))
  document.querySelector('#grid-position-helper em').innerText = JSON.stringify(dqp) + ' :Cell Value [' + dqCanvasCntxt.canvas.Grid.MAP[gridPos[1] ? dqp : gridPos[0]] + ']'
}

function updateDomGenerateLevel() {
  // console.log('dqCanvasCntxt: ', dqCanvasCntxt)
  // console.log('>>>>: ', dqCanvasCntxt.canvas.Grid.MAP)
  console.log('>>>> MAKE THIS LINK TO _lib.mjs/RenderOnCanvas(\'BASE_ROOMS\')(\'BASE_CORRIDORS::NO_DEADENDS\')') // TODO: figure out how to chain and split for opts
  document.getElementById('grid-generate-level').setAttribute('style','pointer-events:none; opacity:.3')
}

window.onload = function() {
  document.getElementById('seed-value').value = Date.now()
}