/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
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
  const [value, setValue] = useState(text);
  const saveData = _value => {
    const newCsvRows = [...csvData[typeOfData]];
    newCsvRows[index][columnName] = _value;
    setCsvData({ ...csvData, [typeOfData]: newCsvRows });
  };

  useEffect(() => {
    setValue(text);
  }, [csvData]);

  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Input
        disabled={autoDisabled}
        style={{ width: DataType.numericTypes.includes(columnType) ? 85 : 175 }}
        value={value}
        onBlur={() => saveData(value)}
        onPressEnter={() => saveData(value)}
        onChange={e => setValue(e.target.value)}
        type={DataType.numericTypes.includes(columnType) ? 'number' : undefined}
      />
    );
  }
  // Boolean type requires dropdown with True and False options
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Select
        disabled={autoDisabled}
        value={Boolean(value)}
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
        value={dayjs(value)}
        onChange={saveData}
      />
    );
  }
  return (
    <TimePicker
      disabled={autoDisabled}
      style={{ width: 80 }}
      format="HH:mm"
      value={dayjs(value, 'HH:mm')}
      onChange={(time, timeString) => saveData(timeString)}
    />
  );
};

export default EditableCell;
