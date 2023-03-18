// import { Space } from 'antd';

export const tableViews = [
  { name: 'Survey', type: 't2' },
  { name: 'Clam', type: 't3' },
  { name: 'Raker', type: 't4' },
];

export const adjustDataType = typeString => {
  const numericTypes = ['int', 'double', 'decimal'];
  const textTypes = ['text', 'varchar'];
  const booleanTypes = ['boolean'];
  const timeTypes = ['datetime', 'timestamp', 'time'];

  let adjustString = '';
  if (numericTypes.includes(typeString)) {
    adjustString = 'Number';
  } else if (timeTypes.includes(typeString)) {
    adjustString = 'Datetime';
  } else if (booleanTypes.includes(typeString)) {
    adjustString = 'Boolean';
  } else if (textTypes.includes(typeString)) {
    adjustString = 'Text';
  } else {
    adjustString = '';
  }

  return adjustString;
};
