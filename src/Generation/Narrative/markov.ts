// deno run --allow-read --allow-write Narrative/markov.ts -n 3 -t word -r 3,7 --src abc,def
import { parse } from '../_utils/_deps.ts'
import {parseSeed, seedPointer} from '../_utils/_seed.ts'

import { ngrams, ngramths } from './ngram.ts'
import FROZEN_PIRATE from './_txt/FrozenPirate.ts'
import THE_PIRATE from './_txt/ThePirate.ts'

const _DEBUG = true

let nGramText = ''
const markovReturnObj = {
  nGramValue: 0,
  seed: 0,
  markovRange: [0,0],
  sources: [''],
  type: 'markov',
}

const setDefaultMarkovObject = () => {
  nGramText = THE_PIRATE+' '+FROZEN_PIRATE
  markovReturnObj.nGramValue = 3
}

const createNGram = () => {
  const filterShort = (wrd:string) => wrd.replace(/\W/g,'').length > 2
  // const mapBacon = (wrd:string) => wrd.replace('piggy','bacon')
  const mutateFncs = {
    filter: [(_:string)=>true],
    map: []
  }
  const _ng = ngrams({n:3, src:nGramText})
  // const _ng = ngrams({n:3, src:piggy+' '+bank}),
  // const _ng = ngrams({src:piggy+' '+bank}),
        // _ngth = ngramths({n:2, src:piggy+' '+bank, mutateFncs})
  mutateFncs['filter'].push(filterShort)
  const _ngth = ngramths({n:3, src:nGramText, mutateFncs})

        // console.log('_ng', _ng)
        console.log('_ngth', _ngth)
  console.log('create markov chain'); 
}

// createNGram()

const determineMarkovText = async () => {
  const convertMarkovText = async () => {
    _DEBUG && console.log('markovReturnObj.sources', markovReturnObj.sources)
    // TODO(@mlnck): DRY THIS
    const srcs = [...markovReturnObj.sources]
    let errorless = true
    while(errorless && srcs.length) {
      const curSrc = srcs.shift()
      try {
        let tryRead = await Deno.readTextFile(`./Narrative/_txt/${curSrc}.txt`) // must be relative from CLI
        tryRead = `const rawText=\`${tryRead.replace(/`/g,'')}\`; export default rawText`
        // console.log('tryRead', tryRead)
        await Deno.writeTextFile(`./Narrative/_txt/_parsed/${curSrc}.ts`, tryRead)
        _DEBUG && console.log('file written: ', `./Narrative/_txt/${curSrc}.ts`)
        nGramText += tryRead + ' '
      } catch (err) {
        errorless = false
        _DEBUG && console.log('Read ERROR: ', err)
      }
    }
    Promise.resolve()
  }
  

  const importedTexts: {[_:string]: string} = {}
  const srcs = [...markovReturnObj.sources]
  let errorless = true
  while(errorless && srcs.length) {
    const curSrc = srcs.shift()
    try {
      const tryLoad = await import(`./_txt/_parsed/${curSrc}.ts`)
      console.log('tryLoad', tryLoad)
      importedTexts[(curSrc as string).toUpperCase().replace(/\s/g,'_')] = tryLoad
      console.log('importedTexts', importedTexts)
    } catch (err) {
      errorless = false
      _DEBUG && console.log('LOAD ERROR: ', err)
    }
  }
  
  if(!errorless && typeof Deno !== 'undefined'){ await convertMarkovText() }
  if(!nGramText.length){ setDefaultMarkovObject() }

  // createNGram() 
  console.log('createNGram here', nGramText)
}
const instantiate = (props:any) => {
  console.log('props', props)
  const parsedArgs = parse(Deno.args)
    const {
      n: nGramValue = 3,
      s: seed = new Date().getTime(),
      r: markovRange = '5,10',
      t: type = 'markov', // word, sentence, title, paragraph, page
      src: sources = ''
    } = parsedArgs

    markovReturnObj.markovRange = markovRange.split(',').map((s: string) => parseInt(s,10))
    markovReturnObj.nGramValue = nGramValue
    markovReturnObj.seed = seed
    markovReturnObj.sources = sources.split(',')
    markovReturnObj.type = type

  seedPointer(0)
  parseSeed(markovReturnObj.seed,300)
  seedPointer.inc() // needed to instantiate seed parsing
  console.log('markovReturnObj', markovReturnObj)
  determineMarkovText()
}

(typeof Deno !== 'undefined') && instantiate(parse(Deno.args)) // CLI
export const newMarkov = () => {
  // instantiate()
  return markovReturnObj
} // Browser