import { BloqType } from "../types.d.ts"

const isValidTimestamp = (newBlock: BloqType, previousBlock: BloqType): boolean => {
  return ( previousBlock.timestamp - 60 < newBlock.timestamp )
      && newBlock.timestamp - 60 < new Date().getTime()
}

// const hashMatchesBlockContent = (block: BloqType): boolean => {
//   const blockHash: string = calculateHashForBlock(block)
//   return blockHash === block.hash
// }

// const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
//   const hashInBinary: string = hexToBinary(hash)
//   const requiredPrefix: string = '0'.repeat(difficulty)
//   return hashInBinary.startsWith(requiredPrefix)
// }


const hasValidHash = (block: BloqType): boolean => {
  // if (!hashMatchesBlockContent(block)) {
  //     console.log('invalid hash, got:' + block.hash)
  //     return false
  // }

  // if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
  //     console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash)
  // }
  return true
}

const isValidBlockStructure = (block: BloqType): boolean => {
  return typeof block.index === 'number'
      && typeof block.hash === 'string'
      && typeof block.previousHash === 'string'
      && typeof block.timestamp === 'number'
      && typeof block.data === 'object'
}
const isValidNewBlock = (newBlock: BloqType, previousBlock: BloqType): boolean => {
  if (!isValidBlockStructure(newBlock)) {
      console.log('invalid block structure: %s', JSON.stringify(newBlock))
      return false
  }
  if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index')
      return false
  } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash')
      return false
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
      console.log('invalid timestamp')
      return false
  } else if (!hasValidHash(newBlock)) {
      return false
  }
  return true
}
