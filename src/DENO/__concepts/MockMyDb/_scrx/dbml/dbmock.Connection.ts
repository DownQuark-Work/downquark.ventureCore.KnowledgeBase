export const mockSingleton = (function () {
  let instance:Object;
  function createInstance()
    { return {dbStructure:{}} }
  return { getInstance: function () {
    if (!instance) { instance = createInstance(); }
    return instance; }
  }
})()

export const runCmd = async (cmdStr:string) => {
  const cmd = cmdStr.split(' ')
  if(!cmd.length) throw new Error('INVALID SUBPROCESS')
  const p = Deno.run({ cmd, stdin: "piped", stdout: "piped",})
  await p.status();
  return p.status
}

export const runSql = async (statement:string) => {
  let sqlResult

  const p = Deno.run({
    cmd: ['mysql', '-u', 'root', '-proot', '-P', '3313'],
    stdin: "piped", stdout: "piped",
  });
  
  if(p.stdin){
    if(Deno.args.includes('-v')) console.log('\nRUNNING: SQL statement:\n')
    if(Deno.args.includes('-vv')) console.log(statement)
    await p.stdin.write(new TextEncoder().encode(statement));
    p.stdin.close();
    await p.status();
    sqlResult = new TextDecoder().decode(await p.output())
  }
  
  // Deno.exit(1)
  console.log('statement executed successfully')
  return sqlResult || true
}