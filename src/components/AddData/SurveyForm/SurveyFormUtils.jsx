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

export const fieldValueBuilder = (value, columnType) => {
  if (DataType.dateTypes.includes(columnType)) {
    return dayjs(value);
  }
  if (DataType.timeTypes.includes(columnType)) {
    return dayjs(value, 'HH:mm');
  }
  return value;
};

const FLEX = '40%';

// eslint-disable-next-line import/prefer-default-export
export const UserInput = ({ columnName, columnType, selectedSurveyId }) => {
  const form = Form.useFormInstance();
  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} form={form} name={columnName} label={columnName}>
        <Input
          disabled={selectedSurveyId}
          type={DataType.numericTypes.includes(columnType) ? 'number' : undefined}
        />
      </Form.Item>
    );
  }
  // Boolean type requires dropdown with True and False options
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} form={form} name={columnName} label={columnName}>
        <Select
          options={[
            { value: false, label: 'false' },
            { value: true, label: 'true' },
          ]}
          disabled={selectedSurveyId}
        />
      </Form.Item>
    );
  }
  // Date type requires DatePicker
  if (DataType.dateTypes.includes(columnType)) {
    return (
      <Form.Item style={{ flex: FLEX }} name={columnName} label={columnName}>
        <DatePicker
          disabled={selectedSurveyId}
          onChange={e => form.setFieldsValue({ [columnName]: e.target.value })}
        />
      </Form.Item>
    );
  }
  // Time type requires TimePicker
  return (
    <Form.Item style={{ flex: FLEX }} name={columnName} label={columnName}>
      <TimePicker
        disabled={selectedSurveyId}
        format="HH:mm"
        onChange={time => form.setFieldsValue({ [columnName]: time })}
      />
    </Form.Item>
  );
};
