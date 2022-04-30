/* End shape should have count amounts to be used in future weighting
{
  this: {
    little:4,
  },
  little: {
    piggy: 4,
  },
  piggy: {
    went: 1,
    stayed: 1,
    had: 2,
  }
}
*/

const markov:{[k:string]:{[k:string]:number}} = {}
const generateMarkov = (text:string[]) => { // pass in as many sources as needed
  const cleanTxt = text[0].replace(/[^\w-]|_/g,'~!~').replace(/(~!~){2,}/g,'~!~').replace('^~!~','').replace('~!~$','')
  const txtArr = cleanTxt.split('~!~')
  txtArr.forEach((txt,indx) => {
    if (!text.length) return

    if(!markov[txt]) markov[txt] = {}
    const insertTxt = txtArr[indx+1] || ''
    if(markov[txt]?.[insertTxt]) markov[txt][insertTxt] = markov[txt][insertTxt] + 1
    else if(!markov[txt]?.[insertTxt]) markov[txt][insertTxt] = 1

    // const insertObj:{[k:string]:number} = {}
    // insertObj[insertTxt] = 0

    // markov[txt] =  markov[txt].length ? {txtArr[indx+1]:}
    console.log('markov', markov)
  })
  console.log('text', txtArr) 
}



const piggy = `This little piggy went to market,

This little piggy stayed home,

This little piggy had roast beef,

This little piggy had none.

This little piggy went ...

Wee, wee, wee,
all the way home`

generateMarkov([piggy])