const BN = web3.utils.BN;
const decimals = new BN("1000000000000000000");

function bn(value) { return new BN(value) };

function assertEq(v1, v2) {
  assert(new BN(v1).eq(new BN(v2)), "v1=" + v1.toString() + " v2=" + v2.toString());
}

module.exports.assertEq = assertEq;
module.exports.verifyBalanceChange = async function(account, change, todo) {
  let before = new BN(await web3.eth.getBalance(account));
  await todo();
  let after = new BN(await web3.eth.getBalance(account));
  let actual = before.sub(after);
  assertEq(change, actual);
}

module.exports.findLog = function(tx, name) {
    var result = [];
    tx.logs.forEach(log => {
        if (log.event == name) {
            result.push(log);
        }
    });
    if (result.length == 0) {
        return null;
    } else if (result.length == 1) {
        return result[0];
    } else {
        return result;
    }
}

module.exports.expectThrow = async function(promise, message) {
  try {
    await promise;
  } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('while processing transaction: revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert(false, message ? message : 'Expected throw not received');
};
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
function randomHexString(length) {
  return "0x" + randomString(length, '0123456789abcdef');
}
function randomInt(max) {
  return Math.floor(Math.random() * max);
}
module.exports.randomString = randomString;
module.exports.randomHexString = randomHexString;
module.exports.randomInt = randomInt;
module.exports.randomAddress = function() {
  return randomHexString(40);
}
module.exports.increaseTime = function(duration) {
  const id = Date.now()
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}