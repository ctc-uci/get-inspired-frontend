import React from 'react';
import PropTypes from 'prop-types';
import { Input, DatePicker, TimePicker, Select, Space } from 'antd';
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

// eslint-disable-next-line import/prefer-default-export
export const EditableCell = ({
  record,
  columnName,
  columnType,
  defaultValue,
  editingState,
  setEditingState,
}) => {
  // const [editedRows, setEditedRows] = useState({});
  const saveData = value => {
    // eslint-disable-next-line react/prop-types
    const newRecord = { ...editingState.editedRows[record.id], [columnName]: value };
    setEditingState({
      ...editingState,
      editedRows: {
        ...editingState.editedRows,
        // eslint-disable-next-line react/prop-types
        [record.id]: newRecord,
      },
    });
  };
  // Date or time type requires input
  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Input
        defaultValue={defaultValue}
        onBlur={e => saveData(e.target.value)}
        onPressEnter={e => saveData(e.target.value)}
        type={DataType.numericTypes.includes(columnType) ? 'number' : undefined}
      />
    );
    // Boolean type requires dropdown with True and False options
  }
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Space wrap>
        <Select
          defaultValue={Boolean(defaultValue)}
          options={[
            { value: false, label: 'False' },
            { value: true, label: 'True' },
          ]}
          onChange={saveData}
        />
      </Space>
    );
    // Date type requires DatePicker
  }
  if (DataType.dateTypes.includes(columnType)) {
    return (
      <DatePicker style={{ width: 125 }} defaultValue={dayjs(defaultValue)} onChange={saveData} />
    );
  }
  // Time type requires TimePicker
  return (
    <TimePicker
      format="HH:mm"
      defaultValue={dayjs(defaultValue, 'HH:mm')}
      onChange={(time, timeString) => saveData(timeString)}
    />
  );
};

EditableCell.propTypes = {
  record: PropTypes.shape({}).isRequired,
  columnName: PropTypes.string.isRequired,
  columnType: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  editingState: PropTypes.shape({
    selectedRowKeys: PropTypes.arrayOf(PropTypes.number).isRequired,
    editedRows: PropTypes.shape({}).isRequired,
  }).isRequired,
  setEditingState: PropTypes.func.isRequired,
};
