// Subfield type enum
const subfieldType = {
  number: 'number',
  text: 'text',
  boolean: 'boolean',
  date: 'date',
  time: 'time',
  datetime: 'datetime',
};

const columnToSubfield = column => {
  const numericTypes = ['int', 'double', 'decimal'];
  const textTypes = ['text', 'varchar'];
  const booleanTypes = ['boolean', 'tinyint'];
  const dateTypes = ['date'];
  const timeTypes = ['time'];
  const dateTimeTypes = ['datetime', 'timestamp'];

  let myType = '';
  if (numericTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.number;
  } else if (textTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.text;
  } else if (booleanTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.boolean;
  } else if (dateTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.date;
  } else if (timeTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.time;
  } else if (dateTimeTypes.includes(column.DATA_TYPE)) {
    myType = subfieldType.datetime;
  } else {
    myType = '';
  }

  const subfield = {
    label: column.COLUMN_NAME,
    type: myType,
    valueSources: ['value'],
  };
  return subfield;
};

export const tableToWidget = (table, columns) => ({
  label: table,
  type: '!group',
  subfields: Object.fromEntries(
    columns.map(column => [`\`${column.COLUMN_NAME}\``, columnToSubfield(column)]),
  ),
});

export const QUERY_PRIMARY_KEYS = ['sid', 'rid', 'cid'];
