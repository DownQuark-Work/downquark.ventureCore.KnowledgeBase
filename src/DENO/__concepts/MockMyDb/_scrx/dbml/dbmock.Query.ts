// INSERT INTO Customers (CustomerName, City, Country) VALUES ('Cardinal', 'Stavanger', 'Norway');
const table='',cols:string[]=[],vals:string[]=[]
const insertTemplate = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${vals.join(',')});`

export const qryRawColumnSchema = `SELECT JSON_OBJECT('table_schema',\`table_schema\`, 'table_name',\`table_name\`, 'column_name',\`column_name\`, 'data_type',\`data_type\`)
  FROM \`information_schema\`.\`COLUMNS\`
  WHERE (\`TABLE_SCHEMA\` = 'MockDbWrite' OR \`TABLE_SCHEMA\` = 'MockDbAggregate') -- TODO: Make this dynamic
  ORDER BY \`TABLE_SCHEMA\`,\`TABLE_NAME\`,\`COLUMN_NAME\`;`
export const qryRawColumnSchemaAgg = `SELECT JSON_ARRAYAGG(JSON_OBJECT('table_schema',\`table_schema\`, 'table_name',\`table_name\`, 'column_name',\`column_name\`, 'data_type',\`data_type\`))
  FROM \`information_schema\`.\`COLUMNS\`
  WHERE (\`TABLE_SCHEMA\` = 'MockDbWrite' OR \`TABLE_SCHEMA\` = 'MockDbAggregate') -- TODO: Make this dynamic
  ORDER BY \`TABLE_SCHEMA\`,\`TABLE_NAME\`,\`COLUMN_NAME\`;`

export const qryRawForeignKeys = `SELECT JSON_OBJECT('id',\`y\`.\`ID\`,'tableFor',\`x\`.\`FOR_NAME\`,'tableRef',\`x\`.\`REF_NAME\`, 'colFor',\`y\`.\`FOR_COL_NAME\`, 'colRef',\`y\`.\`REF_COL_NAME\`) FROM \`information_schema\`.\`INNODB_SYS_FOREIGN\` x
JOIN \`information_schema\`.\`INNODB_SYS_FOREIGN_COLS\` y
  ON x.ID = y.ID;`

const _fullColumnInfo = `SELECT \`TABLE_CATALOG\`, \`TABLE_SCHEMA\`, \`TABLE_NAME\`, \`COLUMN_NAME\`, \`ORDINAL_POSITION\`, \`COLUMN_DEFAULT\`, \`IS_NULLABLE\`, \`DATA_TYPE\`, \`CHARACTER_MAXIMUM_LENGTH\`, \`CHARACTER_OCTET_LENGTH\`, \`NUMERIC_PRECISION\`, \`NUMERIC_SCALE\`, \`DATETIME_PRECISION\`, \`CHARACTER_SET_NAME\`, \`COLLATION_NAME\`, \`COLUMN_TYPE\`, \`COLUMN_KEY\`, \`EXTRA\`, \`PRIVILEGES\`, \`COLUMN_COMMENT\`, \`IS_GENERATED\`, \`GENERATION_EXPRESSION\`
FROM \`information_schema\`.\`COLUMNS\`;`
