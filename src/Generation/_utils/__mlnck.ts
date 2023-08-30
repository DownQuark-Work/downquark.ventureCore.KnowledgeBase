/* Generator to integrate
function *walkGridValues() {
  const colRow = [0,0]
for (const c of gridReturnObj.Grid) {
  colRow[1] = 0
  for (const r of c) {
      yield [r,colRow]
      ++colRow[1]
  }
  ++colRow[0]
}
}
for(const gridVal of walkGridValues()) {}
*/

/*
AS AN ASYNC GENERATOR:
async function *generatorAsyncness() {
          while(iteratorObject.length) {
            const curIterator = iteratorObject.shift()
            await whatever()
            await youNeedTo(curIterator)
            andThen()
            yield curIterator
          }
        }
for await (const curAwaitedIterator of generatorAsyncness()){
        console.log('curAwaitedIterator: ', curAwaitedIterator)
      }
*/

export const ALL_CELLS = (thisArg:any, fnc:any) => {
  console.log('ALL_CELLS >')
  console.log('thisArg', thisArg)
  console.log('fnc', fnc)
  console.log('< ALL_CELLS')
}