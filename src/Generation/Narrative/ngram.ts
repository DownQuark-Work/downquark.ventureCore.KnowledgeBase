// See ReadMe for deetails

export const ngrams = () => {
  const ngram:{[k:string]:{[k:string]:number}} = {}
  const generateNgram = ({n = 1, text =''}) => { // n-gram defaults to single word-level (can extend to character level if desired later on)
    const cleanTxt = text.replace(/[^\w\s-]|_/g,'').replace(/\s/g,'~!~').replace(/(~!~){2,}/g,'~!~').replace('^~!~','').replace('~!~$','').toLowerCase()
    const txtArr = cleanTxt.split('~!~')
    txtArr.forEach((txt,indx) => {
      if (!text.length) return

      // TODO(@mlnck): Extend below to incorporate n-grams
      const insertTxt = txtArr[indx+1] || ''
      if(insertTxt.length) {
        if(!ngram[txt]) ngram[txt] = {}
        if(ngram[txt]?.[insertTxt]) ngram[txt][insertTxt] = ngram[txt][insertTxt] + 1
        else if(!ngram[txt]?.[insertTxt]) ngram[txt][insertTxt] = 1
      }
    })
    console.log('ngram', ngram)
  }
  generateNgram({text:piggy})
  generateNgram({text:bank})
}

export const ngramths = () => {console.log('ngramths', ngramths)}



const piggy = `This little piggy went to market,

This little piggy stayed home,

This little piggy had roast beef,

This little piggy had none.

This little piggy went ...

Wee, wee, wee,
all the way home`

const bank = `Break the little box, get the piggy gold
Just as much as I can hold
Out the door, to the car
Oh, together, we’ll go far

This is a holdup, momma
I was born to be a bank robber
Hand over your last gold dollar`