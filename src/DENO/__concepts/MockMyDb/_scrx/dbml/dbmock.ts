// deno run --allow-read --allow-net --allow-write --allow-run dbmock.ts mockmydb.sql [--drop-only, --dbml-only, --reset]
// --deno-net in case we wish to pull from a webiste at any point in the future
// deno settings location:
// # /Users/mlnck/Development/_dq/dq/downquark.ventureCore.KnowledgeBase/.vscode/settings.json

// REQUIRED FOR BELOW: `% brew install dbml-cli`

import { copySync, emptyDirSync, ensureFileSync } from "https://deno.land/std@0.177.0/fs/mod.ts";

import { mockSingleton, runSql, runCmd } from "./dbmock.Connection.ts";
import { qryRawColumnSchema, qryRawForeignKeys } from "./dbmock.Query.ts";
import { ConvertQueryToJSON, MockSchema } from "./dbmock.Parser.ts";

let dbmlToSqlFile
if(!/\.dbml$/i.test(Deno.args[0])) throw new Error('Please specify a `.dbml` file as the first argument')
const tmpD = Deno.makeTempDirSync({prefix:'mockmydb',suffix:'qrx'})
emptyDirSync(tmpD)
copySync(Deno.args[0], `${tmpD}/${Deno.args[0]}`)
const rc = await runCmd(`dbml2sql markup.dbml --mysql -o ${tmpD}/mockmydb.sql`)
dbmlToSqlFile = `${tmpD}/mockmydb.sql`
console.log('dbmlToSqlFile: ', tmpD)
if(Deno.args.includes('--dbml-only')) Deno.exit(0)

// runCmd

const dbMockDefaults = {},
      dbMockCnfg = {...dbMockDefaults},
      mockSngltn:{[k:string]:any} = mockSingleton.getInstance()

const sqlRawFile = dbmlToSqlFile || Deno.args[0]

// // awesome idea - may work great for this!
// https://github.com/emilwidlund/nodl?ck_subscriber_id=2053558625

// /Volumes/Data/\~transfers/DELETE/repos/git/venture/Core/DownQuarkWorkSite

const mockInMem = Deno.readTextFileSync(`${tmpD}/mockmydb.sql`)

let initialTableFormattedSQL = // removes commas inserted by js when that makies it a list
  String(mockInMem.match(/(CREATE|ALTER) (TABLE|Schema|index) `[^[@][\s\S]*?;/gi)) || ''
initialTableFormattedSQL = String(initialTableFormattedSQL).replace(/;,/g,';\n')
initialTableFormattedSQL = String(initialTableFormattedSQL).replace(/.*\[@.*\s?/gi,'') // removes any rules on a single line (config overrides)
initialTableFormattedSQL = String(initialTableFormattedSQL).replace(/,[\s]*?\);/gi,');') // removes possible invalid syntax due to above line

Deno.writeTextFileSync(`./tmpDbMock/FINAL_${Deno.args[0]}`,initialTableFormattedSQL)

// and to the database
const validSchemas = String(mockInMem.match(/(?<=CREATE Schema `)[^[@][\s\S]*?(?=`;)/gi)).split(',')
const existingSchemas = await runSql('show schemas;')+''
const currentSchemaExists = validSchemas.filter(schema => existingSchemas.includes(schema))
if(currentSchemaExists.length && Deno.args.includes('--reset')) {
  let dropQry = ''
  currentSchemaExists.forEach(curSchema => dropQry += `DROP SCHEMA \`${curSchema}\`;`)
  await runSql(dropQry)
  if(Deno.args.includes('--drop-only')) Deno.exit(0)
}

if(!currentSchemaExists.length || Deno.args.includes('--reset')) {
  await runSql(initialTableFormattedSQL);
  console.log(await runSql('show schemas;'))
}

// with the scaffolding done, we can now create the key maps
  // get foreign keys and column schema from the database
let rawForeignKeys = await runSql(qryRawForeignKeys),
    rawColumnSchema = await runSql(qryRawColumnSchema),
    parsedColumnSchema, parsedForeignKeys

if(typeof rawForeignKeys === 'string') parsedForeignKeys = ConvertQueryToJSON(rawForeignKeys)
if(typeof rawColumnSchema === 'string') parsedColumnSchema = ConvertQueryToJSON(rawColumnSchema)

  // get @rules from generated sql '[previously stored: mockInMem]
  console.log('mockInMem: ', mockInMem)
  // reference values from dbml && original sql
  // Tables regex:
  /* 
    `/CREATE\sTable\s\W([\w\W]+?)\s\([\s\S]*?\);/gim`
      // then loop through looking for all instances of:
          @ rule regex:
    `/\[@[\s\S]*?]/gim`
  */
 // Then find reserved keywords:
/*
  `/(\[@(bridge|arango).*?])|(@(vertex|edge))/gim`
 */

  
/*
reference: regexp through `dbml` file to get the <>,<,>,- and make sure they can be applied correctly
- may also use this time to make sure the translations are doable
  - e.g. id -> uuid is fine, tinyint(2) -> datetime may fail
*/

/*
@ rules may be easier to determine with the `mockInMem` variable we already have stored.
But maybe not ... To be determined.
*/

// once the 2 above comments are resolved we should have everything we need to do the population!

const mockSchema = MockSchema(parsedColumnSchema,parsedForeignKeys)
console.log('mockSchema: ', mockSchema)
