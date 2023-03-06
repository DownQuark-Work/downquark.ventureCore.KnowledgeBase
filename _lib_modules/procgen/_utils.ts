// utils for procgen functions and methods

// closure for util functions requiring width and height to be set.
// allows us to only set it once.
export const setWidthAndHeight = (w:number, h:number):{[k:string]:unknown} => {
  const poissonDisc = () => {
    // https://www.jasondavies.com/poisson-disc/
    // http://www.iro.umontreal.ca/~ostrom/publications/pdf/SIGGRAPH07_SamplingWithPolyominoes.pdf
  }

  const vectorAtPoint = (x:number, y:number): [number,number] => {
    // https://matthewstrom.com/writing/generative-art-og-images
    return [
      Math.sin((x/w) * Math.PI),
      Math.cos((x / w) * Math.PI) * Math.cos((y / h) * Math.PI),
    ]
  }

  return {
    poissonDisc,
    vectorAtPoint
  }
}
/*
const vectorized = setWidthAndHeight(300,500)
undefined
> vectorized.vectorAtPoint(23,300)
// [ 1, -0.30009699631215453 ]
*/