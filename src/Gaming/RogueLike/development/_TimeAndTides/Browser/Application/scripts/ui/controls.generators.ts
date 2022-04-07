// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
// nethack is 63x18 || 73x19
import {generateDungeon} from '../ecsx/entity/dungeon.ts'
import {generateMaze} from '../ecsx/entity/maze.ts'

const createSeedHash = (s = null) => {
  const hashSeed = s || new Date().getTime().toString()
  window.location.hash = hashSeed
}
export const setGeneratorArgs = () => {
  const generatorType = (document.querySelector('h3[data-generator-type]') as HTMLHeadingElement)?.dataset?.generatorType
  const generatorArgs: {[k:string]:number|string} = { gw: 0, gh: 0, a: 'RENDER_MAZE.WITH_BACKTRACKER', sa: 0, ir: 0, }
  const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
  spans.forEach(arg => {
    (generatorArgs[arg.dataset.genAttr || 'gw'] as any) = !isNaN(parseInt(arg.innerText,10)) ? parseInt(arg.innerText,10) : arg.innerText
  })

  if(!generatorArgs.sa) // update hash in url so we can grab if needed
  {
    createSeedHash()
    generatorArgs.sa = parseInt(window.location.hash.replace('#',''))
  }
  const seedInputText = (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText
  if( seedInputText.length && window.location.hash !== '#' + seedInputText) // reflect manual seed update
  { window.location.hash = (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText}

  switch (generatorType) {
    case 'maze':
      (document.getElementById('game') as HTMLDivElement).innerHTML = 'Loading...'
      const {sa: seedArg, a: algorithm, t: mazeType} = generatorArgs
      
      document?.querySelectorAll('[name="maze-type"]').forEach((mazetype) => mazetype.addEventListener('click',() => {
        (document.querySelector('[data-match-to="maze-type"') as HTMLSpanElement).innerHTML = (mazetype as any)?.target?.value
      }))

      generateMaze(({...generatorArgs, seedArg, algorithm, mazeType} as { gw: number; gh: number; algorithm:string; seedArg: number; mazeType: string; }))
      break
    default:
      generateDungeon(({...generatorArgs} as { gw: number; gh: number; sa: number; ir: number; }))
  }
}

export const setMazeTypeArgs = (mzType:string) => {
    console.log('mzType', mzType)
}

if(!window.location.hash) { createSeedHash() }
(document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText = window.location.hash.replace('#','')

if(typeof document !== 'undefined') {
  document?.getElementById('generate-button')?.addEventListener('click',setGeneratorArgs)
  document?.getElementById('generate-random-button')?.addEventListener('click',(e) => {
    (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText = ''
    setGeneratorArgs()
    console.log( '{e}', {e}, (e?.target as HTMLSpanElement)?.dataset?.type )
  })
  document?.querySelectorAll('[data-ref="interesting-seeds"] li')?.forEach(li => li.addEventListener('click',(e) => {
    const seedit = (e.target as HTMLLIElement)?.innerText.split(' ')
    const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
    seedit.forEach((sd,indx) => {
      spans[indx].innerText = sd
    })
    setGeneratorArgs()
  }))
}