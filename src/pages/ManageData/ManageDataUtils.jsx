// Subfield type enum
const subfieldType = {
  number: 'number',
  text: 'text',
  boolean: 'boolean',
  datetime: 'datetime',
};

const columnToSubfield = column => {
  const numericTypes = ['int', 'double', 'decimal'];
  const textTypes = ['text', 'varchar'];
  const booleanTypes = ['boolean'];
  const timeTypes = ['datetime', 'timestamp'];

  let myType = '';
  if (numericTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.number;
  } else if (textTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.text;
  } else if (booleanTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.boolean;
  } else if (timeTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.datetime;
  } else {
    myType = '';
  }

  const subfield = {
    type: myType,
    valueSources: ['value'],
  };
  return subfield;
};

export const tableToWidget = (table, columns) => ({
  label: table,
  type: '!group',
  subfields: Object.fromEntries(
    columns.map(column => [column.COLUMN_NAME, columnToSubfield(column)]),
  ),
});

export const TABLE_PRIMARY_KEYS = ['sid', 'rid', 'cid'];
