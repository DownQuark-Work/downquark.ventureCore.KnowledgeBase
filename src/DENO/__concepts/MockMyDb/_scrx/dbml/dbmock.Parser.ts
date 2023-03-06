type dbStructureObjectType = {[k:string]:undefined|string|boolean}


/**
 * Takes a `CREATE TABLE` sql block and converts the fields into a usable obect for mock value insertion
 * @param columnDef The `CREATE TABLE` _internal_ sql block as an escaped template literal.
 *   - It does _not_ include the `CREATE TABLE` declaration:
 * \`id\` int PRIMARY KEY AUTO_INCREMENT COMMENT '@initial',
 * \`created\` datetime DEFAULT (now()),
 * \`username\` varchar(18) UNIQUE NOT NULL,
 * \`email\` varchar(30) UNIQUE NOT NULL
 */
const parseSqlTableColumns = (columnDef:string): dbStructureObjectType => {
  // updated to pass in entire block - will need to loop through results
  const colData:dbStructureObjectType = { name: columnDef.match(/^`?(\w+)`?/gm)?.[0] || 'INVALID DATA [column name]' }
  columnDef = columnDef.replace(/^`?(\w+)`?\s/gm,'') // remove name from string

  // colData.dataType = columnDef.match(/^(\w+)\s?\((.*?)?\)/gm)?.[0] // $1:data-type:->$2:value -- ENUM:->'dog', 'cat', 'goldfish', 'rock' :: varchar:->12 :: tinyint:->2
  colData.dataType = columnDef.match(/^(\w+)(?=\s?\((.*?)?\))/gm)?.[0] // ENUM, varchar, tinyint
  colData.dataTypeValue = columnDef.match(/(?<=^(\w+)\s?\()(.*?)?(?=\))/gm)?.[0] // `'dog', 'cat', 'goldfish', 'rock'`, 13, 2
  columnDef = columnDef.replace(/^(\w+)\s?\((.*?)?\).?/gm,'') // remove type from string

  // field props
  colData.key = columnDef.match(/(PRIMARY|UNIQUE)/gmi)?.[0]
  colData.autoIncrement = (/TO_INC/gmi).test(columnDef)
  colData.default = columnDef.match(/FAULT\W("[\w\s]+"|\W+([\w\s]+[()]{2}?)\W|\w+)/gmi)?.[0]
  colData.nonNull = (/NOT NULL/gmi).test(columnDef)

  // defaultInsertTypeMap.getFieldParams = 'whatever we return'
  return colData
  // const colName = columnDef.match(/^`?(\w+)`?/gm)?.[0]
  // const colType = columnDef.match(/^(\w+)\s?\((.*?)?\)/gm)?.[0] // $1:data-type:->$2:value -- ENUM:->'dog', 'cat', 'goldfish', 'rock' :: varchar:->12 :: tinyint:->2

  // const [keytype,autoIncrement,hasDefault,notNull] = [
  //   columnDef.match(/(PRIMARY|UNIQUE)/gmi)?.[0],
  //   (/TO_INC/gmi).test(columnDef),
  //   columnDef.match(/FAULT\W("[\w\s]+"|\W+([\w\s]+[()]{2}?)\W|\w+)/gmi)?.[0],
  //   (/NOT NULL/gmi).test(columnDef),
  // ]
}
