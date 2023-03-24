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

const isIsoDate = str => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !Number.isNaN(d) && d.toISOString() === str; // valid date
};

export const humanizeCell = text => {
  if (isIsoDate(text)) {
    return new Date(text).toLocaleDateString();
  }
  return text;
};

export const TABLE_PRIMARY_KEYS = ['sid', 'rid', 'cid'];
