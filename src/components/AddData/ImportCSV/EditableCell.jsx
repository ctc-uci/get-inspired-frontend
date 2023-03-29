/* eslint-disable react/prop-types */
import React from 'react';
import { Input, DatePicker, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';

const DataType = {
  numericTypes: ['int', 'double', 'decimal'],
  textTypes: ['text', 'varchar'],
  booleanTypes: ['boolean', 'tinyint'],
  dateTypes: ['date'],
  timeTypes: ['time'],
};

const EditableCell = ({
  text,
  index,
  typeOfData,
  columnName,
  columnType,
  csvData,
  setCsvData,
  autoDisabled = false,
}) => {
  const saveData = value => {
    const newCsvRows = [...csvData[typeOfData]];
    newCsvRows[index][columnName] = value;
    setCsvData({ ...csvData, [typeOfData]: newCsvRows });
  };

  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Input
        disabled={autoDisabled}
        value={text}
        onChange={e => saveData(e.target.value)}
        onBlur={e => saveData(e.target.value)}
        onPressEnter={e => saveData(e.target.value)}
        type={DataType.numericTypes.includes(columnType) ? 'number' : undefined}
      />
    );
  }
  // Boolean type requires dropdown with True and False options
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Select
        disabled={autoDisabled}
        value={Boolean(text)}
        options={[
          { value: false, label: 'false' },
          { value: true, label: 'true' },
        ]}
        onChange={saveData}
      />
    );
  }
  // Date type requires DatePicker
  if (DataType.dateTypes.includes(columnType)) {
    return (
      <DatePicker
        disabled={autoDisabled}
        style={{ width: 125 }}
        value={dayjs(text)}
        onChange={saveData}
      />
    );
  }
  return (
    <TimePicker
      disabled={autoDisabled}
      style={{ width: 80 }}
      format="HH:mm"
      value={dayjs(text, 'HH:mm')}
      onChange={(time, timeString) => saveData(timeString)}
    />
  );
};

export default EditableCell;
