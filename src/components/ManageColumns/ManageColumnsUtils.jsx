export const tableNames = {
  computation: 'Computation',
  survey: 'Survey',
  clam: 'Clam',
  raker: 'Raker',
};

export const adjustDataType = typeString => {
  const numericTypes = ['int', 'double', 'decimal'];
  const textTypes = ['text', 'varchar'];
  const booleanTypes = ['boolean', 'tinyint'];
  const dateTypes = ['date'];
  const timeTypes = ['time'];

  let adjustString = '';
  if (numericTypes.includes(typeString)) {
    adjustString = 'Number';
  } else if (timeTypes.includes(typeString)) {
    adjustString = 'Time';
  } else if (dateTypes.includes(typeString)) {
    adjustString = 'Date';
  } else if (booleanTypes.includes(typeString)) {
    adjustString = 'Boolean';
  } else if (textTypes.includes(typeString)) {
    adjustString = 'Text';
  } else {
    adjustString = '';
  }

  return adjustString;
};
