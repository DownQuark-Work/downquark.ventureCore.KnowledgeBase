/** Run With: 
 * `% deno run --allow-read --allow-write --allow-env --unstable __PiniaMigrate.ts` # will run all migrations at once
 * `% deno run --allow-read --allow-write --allow-env --unstable __PiniaMigrate.ts 0` # will run all migrations for the module at specified index
 * `% deno run --allow-read --allow-write --allow-env --unstable __PiniaMigrate.ts FILE_NAME` # will run all migrations for the specified file
 * `% deno run --allow-read --allow-write --allow-env --unstable __PiniaMigrate.ts APP` # will run all migrations for the APP module (recommended to be handled separately, and lastly)
 * 
 * > NOTE: See __PiniaMigrationFilesRaw.ts for info about obtaining the migration files
 * 
*/

import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js"

enum MIGRATION_INDEX {
  TYPE=0,
  KEY=1,
}
enum MIGRATION_TYPE {
  APP,
  ERROR,
  MODULE_INDEX,
  MODULE_FILE,
  FILE_PATH,
  FULL,
}
const MIGRATION_TYPE_MAP = {}
const MIGRATION_ERROR:[MIGRATION_TYPE,string] = [MIGRATION_TYPE.ERROR, MIGRATION_TYPE[MIGRATION_TYPE.ERROR]]
const MIGRATION_APP = [MIGRATION_TYPE['APP'],PINIA_APP_MODULE]
/** BEGIN FILE MAPPING */
import {
  PINIA_APP_MODULE,
  piniaNestedModules as piniaNestedModulesByFile,
} from './__PiniaMigrationFiles.ts'
const piniaNestedFilesByModule = {}

let uniqueModules:string[] = []

const defaultNestedModules = {}
let appNestedModules:string[] = []

let defaultNestedFiles = {}
let appNestedFiles:string[] = []

for (const k in piniaNestedModulesByFile) {
  const tmpNestedModule = {}
  tmpNestedModule[k] = []
  piniaNestedModulesByFile[k].forEach(v => {
    uniqueModules.push(v)
    if(!piniaNestedFilesByModule[v]) piniaNestedFilesByModule[v] = []
    piniaNestedFilesByModule[v].push(k)
      
    if(v.indexOf(PINIA_APP_MODULE) !== -1) { // should only be a single instance
      appNestedModules.push(v)
      uniqueModules.pop() // do not want to be able to iterate app on accident
    }
    else tmpNestedModule[k].push(v)
  })
  if(tmpNestedModule[k].length) defaultNestedModules[k] = [...tmpNestedModule[k]]
}

uniqueModules = [...new Set(uniqueModules)]

appNestedModules = [...new Set(appNestedModules)]

appNestedFiles = [...piniaNestedFilesByModule[appNestedModules[0]]]
defaultNestedFiles = {...piniaNestedFilesByModule}
delete defaultNestedFiles['@/store/modules/app.module']

// got WAY too confusing to remember which to use after weeks away
  MIGRATION_TYPE_MAP[MIGRATION_TYPE.APP] = piniaNestedFilesByModule
  MIGRATION_TYPE_MAP[MIGRATION_TYPE.MODULE_INDEX] = defaultNestedFiles
  MIGRATION_TYPE_MAP[MIGRATION_TYPE.MODULE_FILE] = defaultNestedFiles
  MIGRATION_TYPE_MAP[MIGRATION_TYPE.FILE_PATH] = defaultNestedModules
  MIGRATION_TYPE_MAP[MIGRATION_TYPE.FULL] = piniaNestedFilesByModule
/** END FILE MAPPING */


/** BEGIN MIGRATION CONFIG */
const dargs:string = Deno.args[0]
let currentMigration: any, // [MIGRATION_TYPE, string],
    currentMigrationIteration = 0
if(
    Deno.args?.length
  ) {
  const setMigrationType = () => {
    if(dargs === '-v' || dargs === '--verbose') return [MIGRATION_TYPE.FULL, uniqueModules[currentMigrationIteration]]
    if(!isNaN(dargs-0)){
      currentMigrationIteration = dargs-0
      return (currentMigrationIteration < uniqueModules.length) ? [MIGRATION_TYPE.MODULE_INDEX, uniqueModules[currentMigrationIteration]] : MIGRATION_ERROR
    }
    if(dargs[0] === '@'){
      return uniqueModules.includes(dargs) ? [MIGRATION_TYPE.MODULE_FILE, dargs] : MIGRATION_ERROR
    }
    if(defaultNestedModules[dargs]) return [MIGRATION_TYPE.FILE_PATH, dargs]
    if(dargs === 'APP') return MIGRATION_APP // APP
    // if(typeof MIGRATION_TYPE[dargs] !== 'undefined') return [MIGRATION_TYPE[dargs],PINIA_APP_MODULE] // future scalability
    return MIGRATION_ERROR // default
  }
  currentMigration = setMigrationType()
} else currentMigration = [MIGRATION_TYPE.FULL, uniqueModules[currentMigrationIteration]]
/** END MIGRATION CONFIG */

if(currentMigration[MIGRATION_INDEX.TYPE] === MIGRATION_ERROR[MIGRATION_INDEX.TYPE])
{
  console.error(chalk.red.bold.underline(chalk.inverse(' '+dargs+' '),'is out of scope for the current migration.'))
  Deno.exit(1)
}

// console.log('currentMigration', MIGRATION_TYPE[currentMigration[0]], currentMigration)

// currentMigrationIteration
/** BEGIN MIGRATIONS */

/**
 * HELPER function to determine scope of requested modules|components
 * @returns Array of (module|component) paths available in the file specified
 */
const getCurrentMigrationCorrespondingPaths = () =>
  MIGRATION_TYPE_MAP[currentMigration[MIGRATION_INDEX.TYPE]][currentMigration[MIGRATION_INDEX.KEY]]

const migrateState = () => { // will probably need this to be recursive - making it a function

  const denoArgType = currentMigration[MIGRATION_INDEX.TYPE] === MIGRATION_TYPE.FILE_PATH ? 'Component' : 'Module'
  const currentMigrationPathsArray = [
    [currentMigration[MIGRATION_INDEX.KEY]], // specified key/index as Deno.args
    getCurrentMigrationCorrespondingPaths(), // corresponding content
  ]
  const totalMigrations = currentMigrationPathsArray[1].length
  const currentMigrationPaths = {
    COMPONENTS: denoArgType === 'Component'
                ? currentMigrationPathsArray.shift() // component specified as argument
                : currentMigrationPathsArray.pop(), // module specified as argument
    MODULES: currentMigrationPathsArray.pop(),
  }
  // console.log('currentMigrationPaths',currentMigrationPaths)

  console.log('---------------TEST---------')
    const tst = Deno.openSync('__PiniaMigrate.ts',{read:true, write:true})
    const tstFileInfo = tst.statSync();

    // not sure if files will be too big but this could work:
    // - let mockInMem = Deno.readTextFileSync('./tmpDbMock/TEMP_tmp.sql')

    let totalFileSize = 0
    const chunkLoop = (chunkSize = 750) => {
      const buf = new Uint8Array(chunkSize);
      const curBytesRead = tst.readSync(buf);
      totalFileSize += curBytesRead
        console.log('->curBytesRead ',curBytesRead, totalFileSize)
      const textFile = new TextDecoder().decode(buf);
      console.log('textFile',textFile, `[${totalFileSize}]`)
      if(totalFileSize < 30000 &&  // totalFileZise check is failsafe for debug - remove when ready
          curBytesRead >= chunkSize) chunkLoop() // keep looping until buffer has not been exahausted
 
    }

    if (tstFileInfo.isFile) chunkLoop()
  console.log('------------------------')

  const migrateStateInComponent = (curMigrationComponentPath) => {
    if(Deno.args.includes('-v') || Deno.args.includes('--verbose'))
      console.log(chalk.bgAnsi256(194).dim('Migrating State In Component: ', curMigrationComponentPath.split('/').pop()))
    if(currentMigrationPaths.COMPONENTS.length){
      migrateStateInComponent(currentMigrationPaths.COMPONENTS.pop())
    }
  }
  migrateStateInComponent(currentMigrationPaths.COMPONENTS.pop())
  
  // LOOP # all associated component files
    // open component file

    // LOOP # Purposefully doing the loop for better control - less error prone than strict regex
      // match module import
        // in a temp array: capture and push each import variable name (e.g. `import notifications from` _OR_ `import transmissionsModule from`)
        // - being default it could even be `import zebraHippo from`
      // regex to replace path with updated store
      // regext to replace zebraHippo with useNotificationsStore # making names consistent
    // POOL

    // LOOP # for all in temp array
      // replace all body instances of zebraHippo<DOT> 
        // _&&||_
      /*
        zebraHippo
          <DOT>
      */
     // with consistent naming
    // POOL

    // close component file
  // POOL

  console.log(' ')
  console.log(chalk.bgAnsi256(222)(chalk.bold(`FINISHED`), `migrating the ${denoArgType}: ${currentMigration[MIGRATION_INDEX.KEY].split('/').pop()}  \n  `, chalk.ansi256(200).bold('['+totalMigrations+']'), ` ${denoArgType === 'Component' ? 'Modules' : 'Components'} were updated.`),'\n\n---\n')


  if(
      currentMigration[MIGRATION_INDEX.TYPE] === MIGRATION_TYPE.MODULE_INDEX
      || currentMigration[MIGRATION_INDEX.TYPE] === MIGRATION_TYPE.FULL
    ) {
      const skipPrompt = currentMigration[MIGRATION_INDEX.TYPE] === MIGRATION_TYPE.FULL
      console.log(chalk.bgAnsi256(182)(`Completed migration of module ${++currentMigrationIteration} / ${uniqueModules.length}`))
      if(currentMigrationIteration < uniqueModules.length) { // default modules loop 
        const proceedPrompt = skipPrompt
          ? 'Y'
          : prompt(chalk.bgAnsi256(183)('Proceed to the next module:',chalk.bold('['+uniqueModules[currentMigrationIteration].split('/').pop()+']'),'(Yn)'))
        if(proceedPrompt?.[0].toLowerCase() !== 'n')
        {
          currentMigration[1] = uniqueModules[currentMigrationIteration]
          migrateState()
        }
      } else { // app module
        const proceedPrompt = skipPrompt
          ? 'Y'
          : prompt(chalk.bgAnsi256(183)('Proceed to final module:',chalk.bold('['+PINIA_APP_MODULE.split('/').pop()+']'),'(Yn)'))
        currentMigration = MIGRATION_APP
        migrateState()
      }
  }
}
migrateState()
// console.log('ZCX_MIGRATION_TYPE', MIGRATION_TYPE_MAP[currentMigration[MIGRATION_INDEX.TYPE]])
/** END MIGRATIONS */

// DEV

// console.log('modules', uniqueModules, uniqueModules.includes(dargs))
// console.log('PINIA_APP_MODULE: ', PINIA_APP_MODULE)

// console.log('full nested modules by file: ',
//   Object.keys(piniaNestedModulesByFile).length,
//   'with app: ', appNestedModules.length,
//   'and without: ', Object.keys(defaultNestedModules).length) 
// // full nested with app:  130 with app: 1 and without:  90

// console.log('full nested files by module: ',
//   Object.keys(piniaNestedFilesByModule).length,
//   'with app: ', appNestedFiles.length,
//   'and without: ', Object.keys(defaultNestedFiles).length) 
// // full nested files by module:  14 with app:  94 and without:  13

// console.log('defaultNestedModules: ', defaultNestedModules)
// console.log('piniaNestedModulesByFile',piniaNestedModulesByFile)

// console.log('piniaNestedFilesByModule', piniaNestedFilesByModule)
// console.log('appNestedFiles',defaultNestedFiles)

// console.log('appNestedModules',appNestedModules)
// console.log('appNestedFiles',appNestedFiles)