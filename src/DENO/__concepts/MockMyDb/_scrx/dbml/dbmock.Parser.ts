type colSchemaType = {[k:string]:Array<{[k:string]:string}>}
type dbStructureObjectType = {[k:string]:undefined|string|boolean}
type foreignKeysType = {[k:string]:Array<{[k:string]:string|number}>}
type structuredSchemaType = {[k:string]:{[k:string]:{[k:string]:string}}}

export const ConvertQueryToJSON = (rawQueryResult:string) => {
  let queryResult = rawQueryResult
    .replace(/JSON_OBJECT.*\)/gi,'{"queryResult":[')
    .replace(/}/g,'},')
  queryResult += ']}'
  queryResult = queryResult.replace(/},[\S\s]]}/gm,'}]}')
  const parsedQueryResult = JSON.parse(queryResult)
  return parsedQueryResult
}

export const MockSchema = (colSchema:colSchemaType, foreignKeys:foreignKeysType) => {
  // const destructuredSchema = colSchema // if using JSON_ARRAYAGG
  const destructuredSchema = colSchema[Object.keys(colSchema)[0]],
        structuredSchema:structuredSchemaType  = {}
  destructuredSchema.forEach(col => {
    if(!structuredSchema[col.table_schema]) structuredSchema[col.table_schema] = {}
    if(!structuredSchema[col.table_schema][col.table_name]) structuredSchema[col.table_schema][col.table_name] = {}
    structuredSchema[col.table_schema][col.table_name][col.column_name] = col.data_type
  })
  const structuredForeignKeys = foreignKeys[Object.keys(foreignKeys)[0]]
  return {schema:structuredSchema, keys:structuredForeignKeys}
} 


// Table\s("|')[a-zA-Z0-9].+{