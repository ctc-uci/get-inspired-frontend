/* eslint-disable react/prop-types */
import React from 'react';
import { Input, Form, DatePicker, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const DataType = {
  numericTypes: ['int', 'double', 'decimal'],
  textTypes: ['text', 'varchar'],
  booleanTypes: ['boolean', 'tinyint'],
  dateTypes: ['date'],
  timeTypes: ['time'],
};

const fieldValueBuilder = (value, columnType) => {
  if (DataType.dateTypes.includes(columnType)) {
    return dayjs(value);
  }
  if (DataType.timeTypes.includes(columnType)) {
    return dayjs(value, 'HH:mm');
  }
  if (DataType.booleanTypes.includes(columnType)) {
    return Boolean(value);
  }
  return value;
};

const FLEX = '40%';

// eslint-disable-next-line import/prefer-default-export
export const UserInput = ({ columnName, value, columnType }) => {
  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} label={columnName}>
        <Input disabled value={fieldValueBuilder(value, columnType)} />
      </Form.Item>
    );
  }
  // Boolean type requires dropdown with True and False options
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} name={columnName} label={columnName}>
        <Select
          disabled
          value={fieldValueBuilder(value, columnType)}
          options={[
            { value: false, label: 'false' },
            { value: true, label: 'true' },
          ]}
        />
      </Form.Item>
    );
  }
  // Date type requires DatePicker
  if (DataType.dateTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} label={columnName}>
        <DatePicker value={fieldValueBuilder(value, columnType)} disabled />
      </Form.Item>
    );
  }
  // Time type requires TimePicker
  return (
    <Form.Item style={{ flex: FLEX }} label={columnName}>
      <TimePicker disabled value={fieldValueBuilder(value, columnType)} format="HH:mm" />
    </Form.Item>
  );
};
