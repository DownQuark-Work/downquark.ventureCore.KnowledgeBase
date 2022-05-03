import { ngrams, ngramths } from './ngram.ts'
import { FROZEN_PIRATE } from './_txt/FrozenPirate.ts'

const markovChain = () => {
  const filterShort = (wrd:string) => wrd.replace(/\W/g,'').length > 2
  const mapBacon = (wrd:string) => wrd.replace('piggy','bacon')
  const mutateFncs = {
    filter: [filterShort],
    map: [mapBacon]
  }
  const _ng = ngrams({n:2, src:FROZEN_PIRATE, mutateFncs}),
  // const _ng = ngrams({n:3, src:piggy+' '+bank}),
  // const _ng = ngrams({src:piggy+' '+bank}),
        // _ngth = ngramths({n:2, src:piggy+' '+bank, mutateFncs})
        _ngth = ngramths({n:2, src:FROZEN_PIRATE, mutateFncs})

        console.log('_ng', _ng)
        console.log('_ngth', _ngth)
  console.log('create markov chain'); 
}

markovChain()