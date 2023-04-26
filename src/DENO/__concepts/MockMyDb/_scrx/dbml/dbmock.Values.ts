// /dq/dq/downquark.ventureCore.KnowledgeBase/src/Gaming/_scrx/src/_dq-lib/_utils/content/_fakerjs/definitions/date.ts
// ('../../../../../Gaming/_scrx/src/_dq-lib/_utils/content/_fakerjs')
// import tst from '../../../../../../_lib_modules/_utils/content/_fakerjs/definitions'
import mockbear from '../../../../../../_lib_modules/_utils/content/_fakerjs/locales/en/animal/bear.ts'
import mocknoun from '../../../../../../_lib_modules/_utils/content/_fakerjs/locales/en/word/noun.ts'
false && console.log('mockbear: ', mockbear, mocknoun)

const mockFnc = {
  randomRangeInt: (min:number,max:number) => Math.random() * (max - min) + min,
  uuid: () => crypto.randomUUID(),
}

export const defaultInsertTypeMap = {
  AUTO_INCREMENT:'_AUTO_INC',
  BIGINT:mockFnc.randomRangeInt(-9223372036854775808,9223372036854775807),
  BINARY:'[a-zA-z]{$VAL}', // $VAL is what was specified on field creation: `\`alphabet\` binary(26)` # $VAL == 26
  BIT:mockFnc.randomRangeInt(100,500),
  BLOB:'_MARKOV_',
  BOOLEAN:mockFnc.randomRangeInt(0,1),
  CHAR:'=VARCHAR',
  DATE:'',
  DATETIME:'0..1000"."1..1000',
  DECIMAL:'',
  DOUBLE:'=DECMIAL',
  ENUM:'_ONE_OF_$VAL',
  FLOAT:'=DECIMAL',
  INET4:'',
  INET6:'',
  INT:mockFnc.randomRangeInt(-2147483648,2147483647),
  INT1:'=TINYINT',
  INT2:'=SMALLINT',
  INT3:'=MEDIUMINT',
  INT4:'=INT',
  INT8:'=BIGINT',
  INTEGER:'=INT',
  'JSON':'',
  LONGBLOB:'',
  LONGTEXT:'_MARKOV_4294967295', // 4gb
  MEDIUMBLOB:'',
  MEDIUMINT:mockFnc.randomRangeInt(-8388608,8388607),
  MEDIUMTEXT:'_MARKOV_16777215',
  NULL:'',
  NUMBER:'',
  ROW:'',
  SET:'',
  SMALLINT:mockFnc.randomRangeInt(-32768,32767),
  TEXT:'_MARKOV_65535',
  TIME:'',
  TIMESTAMP:'',
  TINYBLOB:'',
  TINYINT:'',
  TINYTEXT:'=VARCHAR',
  UUID:mockFnc.uuid(),
  VARBINARY:'=BINARY',
  VARCHAR:'LOREM_255',
  YEAR:'',
}