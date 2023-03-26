/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, DatePicker, TimePicker, Select, Space, Button } from 'antd';
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

const equals = (record, newRecord) =>
  record &&
  newRecord &&
  Object.keys(record).every(key => record[key].toString() === newRecord[key].toString());

// eslint-disable-next-line import/prefer-default-export
export const EditableCell = ({
  text,
  record,
  originalRecord,
  index,
  columnName,
  columnType,
  editingState,
  setEditingState,
  tableState,
  setTableState,
}) => {
  const onChange = value => {
    // For some reason this line has to be there so typing more than 2 characters doesn't re-render the table???
    setEditingState({ ...editingState });
    // Update the tableState with the new data value
    const newTableState = { ...tableState };
    newTableState.rows[index][columnName] = value;
    setTableState(newTableState);
  };
  // Sets editingState.editedRows according to if the new value is different from the original value
  const saveData = value => {
    const newRecord = {
      ...(record.id in editingState.editedRows ? editingState.editedRows[record.id] : record),
      [columnName]: value,
    };
    // If the new value is the same as the original value, remove the record from editedRows
    if (equals(originalRecord, newRecord)) {
      const { [record.id]: _, ...editedRows } = editingState.editedRows;
      setEditingState({ ...editingState, editedRows });
      // If the new value is different from the original value, add the record to editedRows
    } else {
      setEditingState({
        ...editingState,
        editedRows: {
          ...editingState.editedRows,
          [record.id]: newRecord,
        },
      });
    }
  };
  // Date or time type requires input
  if (DataType.numericTypes.includes(columnType) || DataType.textTypes.includes(columnType)) {
    return (
      <Input
        style={{ width: DataType.numericTypes.includes(columnType) ? 75 : 175 }}
        value={text}
        onChange={e => onChange(e.target.value)}
        onBlur={e => saveData(e.target.value)}
        onPressEnter={e => saveData(e.target.value)}
        type={DataType.numericTypes.includes(columnType) ? 'number' : undefined}
      />
    );
  }
  // Boolean type requires dropdown with True and False options
  if (DataType.booleanTypes.includes(columnType)) {
    return (
      <Space wrap>
        <Select
          defaultValue={Boolean(text)}
          options={[
            { value: false, label: 'false' },
            { value: true, label: 'true' },
          ]}
          onChange={saveData}
        />
      </Space>
    );
  }
  // Date type requires DatePicker
  if (DataType.dateTypes.includes(columnType)) {
    return <DatePicker style={{ width: 125 }} defaultValue={dayjs(text)} onChange={saveData} />;
  }
  // Time type requires TimePicker
  return (
    <TimePicker
      style={{ width: 80 }}
      format="HH:mm"
      defaultValue={dayjs(text, 'HH:mm')}
      onChange={(time, timeString) => saveData(timeString)}
    />
  );
};

export const UndoButton = ({
  originalRecord,
  index,
  tableState,
  setTableState,
  editingState,
  setEditingState,
}) => {
  const undoChanges = () => {
    // Update the table state with original values
    const newTableState = { ...tableState };
    newTableState.rows[index] = { ...originalRecord };
    setTableState(newTableState);
    //  Remove the record from editedRows
    const { [originalRecord.id]: _, ...editedRows } = editingState.editedRows;
    setEditingState({ ...editingState, editedRows });
  };
  return (
    <Button onClick={undoChanges} disabled={!(originalRecord.id in editingState.editedRows)}>
      Undo
    </Button>
  );
};

UndoButton.propTypes = {
  originalRecord: PropTypes.shape({}).isRequired,
  editingState: PropTypes.shape({
    selectedRowKeys: PropTypes.arrayOf(PropTypes.number).isRequired,
    editedRows: PropTypes.shape({}).isRequired,
  }).isRequired,
  setEditingState: PropTypes.func.isRequired,
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
