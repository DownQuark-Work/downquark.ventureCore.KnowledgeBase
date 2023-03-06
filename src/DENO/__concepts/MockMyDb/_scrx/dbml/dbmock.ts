// deno run --allow-read --allow-net --allow-write --unstable dbmock.ts mockmydb.sql
// --deno-net in case we wish to pull from a webiste at any point in the future
// [ref vs foreign key](https://www.geeksforgeeks.org/difference-between-entity-constraints-referential-constraints-and-semantic-constraints/)
// deno settings location:
// # /Users/mlnck/Development/_dq/dq/downquark.ventureCore.KnowledgeBase/.vscode/settings.json


import { copySync, emptyDirSync, ensureFileSync } from "https://deno.land/std@0.177.0/fs/mod.ts"; // requires `--unstable` flag
console.log('started with: ', Deno.args)

export const dbmockSingleton = (function () {
  let instance:Object;
  function createInstance()
    { return {dbStructure:{}} }
  return { getInstance: function () {
    if (!instance) { instance = createInstance(); }
    return instance; }
  }
})()

const dbMockDefaults = {},
      dbMockCnfg = {...dbMockDefaults},
      mockSngltn:{[k:string]:any} = dbmockSingleton.getInstance()

emptyDirSync('tmpDbMock')
copySync(Deno.args[0], './tmpDbMock/TEMP_tmp.sql')
ensureFileSync(`./tmpDbMock/FINAL_${Deno.args[0]}`)

// // awesome idea - may work great for this!
// https://github.com/emilwidlund/nodl?ck_subscriber_id=2053558625

let mockInMem = Deno.readTextFileSync('./tmpDbMock/TEMP_tmp.sql')
const initialDbTableFlag = mockInMem.match(/((TABLE).*`\.`(.+)`.*\()|@initial/gm) || '',
      initialDbTable = String(initialDbTableFlag).match(/([+-@\.\w]+?)`\.`(.+)(?=`.*\([^]@initial)/gm) || '',
      [initialDb, initialTable]:string[] = String(initialDbTable).split(/\W?\.\W?/)

      console.log('dbStructure: ', mockSngltn.dbStructure)
      mockSngltn.dbStructure[initialDb] = {}
      mockSngltn.dbStructure[initialDb][initialTable] = {}
      console.log('dbStructure:: ', mockSngltn.dbStructure)

// get initial sql values for primary query level
  // initialTableFlag
const initialTableSQL:string = String(mockInMem.match(/CREATE TABLE `\+[\s\S]*?\);/gm)) || ''
let initialTableRefsSQL:string = String(mockInMem.match(/(^(CREATE|ALTER).+\+mockmydb.*[\s\S].?);/gm)) || '',
    initialTableSchemaSQL:string = String(initialTableRefsSQL.match(/CREATE SCHEMA `.\w+`;/g))
    initialTableRefsSQL = initialTableRefsSQL.replace(/CREATE SCHEMA `.\w+`;\W?/g,'')

const initialTableFormattedSQL = // removes commas inserted by js when that makies it a list
  (initialTableSchemaSQL+String(initialTableSQL)+initialTableRefsSQL).replace(/;,/g,';')

  // setTimeout(()=>{console.log('initialTableSQL: ', initialTableSQL)}, 1000)
// console.log('mockInMem: ', initialTableSQL)
// console.log('initialTableRefsSQL: ', initialTableRefsSQL)
// console.log('---');
// console.log('initialTableSchemaSQL: ', initialTableSchemaSQL)


Deno.writeTextFileSync(`./tmpDbMock/FINAL_${Deno.args[0]}`,initialTableFormattedSQL)


/*
const p = Deno.run({ cmd: [ "echo", "hello world" ], stderr: 'piped', stdout: 'piped' });
const [status, stdout, stderr] = await Promise.all([
  p.status(),
  p.output(),
  p.stderrOutput()
]);
p.close();
console.log('status, stdout, stderr: ', status, stdout, stderr)
*/

