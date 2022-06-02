import { seedPointer } from '../_utils/_seed.ts'

const noMatchesFill = ['\'','-']
const markovData:any = {
  methods: {},
  ngram:{},
  range:[0,0],
  type:'markov',
  MarkovReturn: ''
}

const createMarkovWord = () => {
  const { ngram, range } = markovData
  const ngramth = ngram.ngramth,
      beginningOfWord = ngram._bow,
      endOfWord = ngram._eow
  const ngramthArr = Object.keys(ngramth),
        bOWArr = Object.keys(beginningOfWord)
  // console.log('ngramth', ngramth)
  ngramth.stats = {_length: ngramthArr.length}
  const stopPointVal = seedPointer.pointerValue + 11
  const nLen = ngramthArr[ngramthArr.length-1].length*-1
  let accumVal = 0,
      rangeVal = Math.round((range[1]-range[0])*(seedPointer.inc()/10))+range[0]
  while (seedPointer.pointerValue < stopPointVal)
  { accumVal += seedPointer.inc() }
  const startIndex = bOWArr.length > 2 // [ "_length", "_sum" ] will always be available
    ? bOWArr[Math.floor(beginningOfWord._length * (accumVal/100))]
    : ngramthArr[Math.floor(ngramth.stats._length * (accumVal/100))]
  let curNGramthKey = ngramth[startIndex]
  // console.log('startIndex', startIndex, curNGramthKey, rangeVal, nLen)
  markovData.MarkovReturn += startIndex
  while (rangeVal>0){ 
    --rangeVal
    const curNGramthKeyEntries = curNGramthKey ? Object.entries(curNGramthKey) : []
    const percentageKeyArray:string[] = []
    if(!curNGramthKeyEntries.length){
      markovData.MarkovReturn += seedPointer.inc() > 7 ? noMatchesFill[1] : noMatchesFill[0]
      curNGramthKey = ngramth[ngramthArr[Math.floor(accumVal)]]
      accumVal = Math.floor(accumVal/seedPointer.inc())
    }
    else {
      curNGramthKeyEntries.forEach(nG => { for(let nGi=0; nGi < (nG[1] as number); nGi++){ percentageKeyArray.push(nG[0]) } })
      // console.log('set percentageKeyArray', percentageKeyArray)
      const percentNum = Math.floor(percentageKeyArray.length*(seedPointer.inc()/10)),
            percentChar = percentageKeyArray[percentNum]
      markovData.MarkovReturn += percentChar
      // console.log('set markovData.MarkovReturn', markovData.MarkovReturn, percentNum)
      // console.log('decrement count value', curNGramthKey, percentChar, curNGramthKey[percentChar]);
      curNGramthKey[percentChar] = curNGramthKey[percentChar] - 1
      if(curNGramthKey[percentChar] === 0) delete curNGramthKey[percentChar]

      
      if(endOfWord[markovData.MarkovReturn.substr(nLen)] && seedPointer.inc() % 2 === 1) markovData.MarkovReturn += seedPointer.inc() > 7 ? noMatchesFill[1] : noMatchesFill[0]
      curNGramthKey = ngramth[markovData.MarkovReturn.replace(/['-]/g,'').substr(nLen)] || {}
    }
  }
  markovData.MarkovReturn = markovData.MarkovReturn.replace(/['-]+$/,'')
  console.log('WORD: ', markovData.MarkovReturn);
}

markovData.methods = {
  word:createMarkovWord,
  sentence:createMarkovWord,
  title:createMarkovWord,
  paragraph:createMarkovWord,
  page:createMarkovWord,
}

export const markovChain = (ngram:any, range=[3,7], type='markov') => {
  console.log('TODO: could be fun to replace words from other methods with those we generated');
  console.log('e.g. generate a few words, store in an array, replace ship, sword, and hat respectively');
  console.log('ngram', ngram)
  markovData.MarkovReturn = ''
  markovData.ngram = {...ngram}
  markovData.range = range
  markovData.type = type
  markovData.methods[type]()
}
