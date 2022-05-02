import { ngrams, ngramths } from './ngram.ts'

const piggy = `This little piggy went to market, This little piggy stayed home, This little piggy had roast beef, This little piggy had none. This little piggy went ... Wee, wee, wee, all the way home`
const bank = `Break the little box, get the piggy gold. Just as much as I can hold. Out the door, to the car. Oh, together, we’ll go far? This is a holdup! momma I was born to be a bank robber. Hand over your last gold dollar!`

const markovChain = () => {
  const filterShort = (wrd:string) => wrd.replace(/\W/g,'').length > 2
  const mapBacon = (wrd:string) => wrd.replace('piggy','bacon')
  const mutateFncs = {
    filter: [filterShort],
    map: [mapBacon]
  }
  const _ng = ngrams({n:2, src:piggy+' '+bank, mutateFncs}),
  // const _ng = ngrams({n:3, src:piggy+' '+bank}),
  // const _ng = ngrams({src:piggy+' '+bank}),
        _ngth = ngramths()
  console.log('_ng', _ng)
  console.log('create markov chain'); 
}

markovChain()