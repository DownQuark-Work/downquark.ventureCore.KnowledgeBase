const isValidTimestamp = (newBlock: Bloq, previousBlock: Bloq): boolean => {
  return ( previousBlock.timestamp - 60 < newBlock.timestamp )
      && newBlock.timestamp - 60 < getCurrentTimestamp();
};

const hasValidHash = (block: Bloq): boolean => {

  if (!hashMatchesBlockContent(block)) {
      console.log('invalid hash, got:' + block.hash);
      return false;
  }

  if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
      console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash);
  }
  return true;
};
const isValidBlockStructure = (block: Bloq): boolean => {
  return typeof block.index === 'number'
      && typeof block.hash === 'string'
      && typeof block.previousHash === 'string'
      && typeof block.timestamp === 'number'
      && typeof block.data === 'object';
};
const isValidNewBlock = (newBlock: Bloq, previousBlock: Bloq): boolean => {
  if (!isValidBlockStructure(newBlock)) {
      console.log('invalid block structure: %s', JSON.stringify(newBlock));
      return false;
  }
  if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index');
      return false;
  } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash');
      return false;
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
      console.log('invalid timestamp');
      return false;
  } else if (!hasValidHash(newBlock)) {
      return false;
  }
  return true;
}
