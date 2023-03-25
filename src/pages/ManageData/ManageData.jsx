import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Radio, Cascader, Table, Typography, Button, Input } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import { GSPBackend, keysToCamel, toCamel } from '../../utils/utils';
import styles from './ManageData.module.css';

const { Title } = Typography;

const EditableCell = ({ record, columnName, defaultValue, editingState, setEditingState }) => {
  const saveInput = e => {
    const newRecord = { ...record, [columnName]: e.target.value };
    setEditingState({
      ...editingState,
      editedRows: {
        ...editingState.editedRows,
        // eslint-disable-next-line react/prop-types
        [record.id]: newRecord,
      },
    });
  };
  return <Input defaultValue={defaultValue} onBlur={saveInput} onPressEnter={saveInput} />;
};

EditableCell.propTypes = {
  record: PropTypes.shape({}).isRequired,
  columnName: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  editingState: PropTypes.shape({
    selectedRowKeys: PropTypes.arrayOf(PropTypes.number).isRequired,
    editedRows: PropTypes.shape({}).isRequired,
  }).isRequired,
  setEditingState: PropTypes.func.isRequired,
};

const ManageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('survey');
  const [editingMode, setEditingMode] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState([]);

  const [editingState, setEditingState] = useState({
    selectedRowKeys: [],
    editedRows: {},
  });

  const [tableState, setTableState] = useState({ rows: [], columns: [] });

  const onSurveyChange = ([, surveyId]) => {
    setSelectedSurveyId(surveyId);
  };

  // Object with options to handle when user selects one or more rows
  const rowSelection = {
    onChange: selectedRowKeys => {
      setEditingState({ ...editingState, selectedRowKeys });
    },
  };

  // Creates columns for table based on SQL table columns
  const computeColumnsFromSQL = columnData =>
    columnData.map(col => ({
      title: toCamel(col.COLUMN_NAME),
      key: toCamel(col.COLUMN_NAME),
      dataIndex: toCamel(col.COLUMN_NAME),
      type: col.DATA_TYPE,
    }));

  // Creates columns for table based on existing columns (switches to input if in editing mode)
  const computeColumnsFromExisting = columnData =>
    columnData.map(col => ({
      ...col,
      render:
        col.title !== 'id' && col.title !== 'survey_id' && editingMode
          ? (text, record) => (
              <EditableCell
                record={record}
                columnName={col.title}
                defaultValue={text}
                editingState={editingState}
                setEditingState={setEditingState}
              />
            )
          : undefined,
    }));

  // Fetches table data based on selected survey and table
  const fetchTableData = async () => {
    const rowDataUrl = selectedSurveyId
      ? `/${selectedTable}s/survey/${selectedSurveyId}`
      : `/${selectedTable}s`;
    const requests = [
      GSPBackend.get(`/tables/${selectedTable}/columns`),
      GSPBackend.get(rowDataUrl),
    ];
    const [{ data: columnData }, { data: rowData }] = await Promise.all(requests);
    setTableState({
      rows: keysToCamel(rowData).map(row => ({ ...row })),
      columns: computeColumnsFromSQL(columnData),
    });
  };

  const cancelEditingMode = () => {
    setEditingMode(false);
    setEditingState({ selectedRowKeys: [], editedRows: {} });
  };

  const deleteSelectedRows = async () => {
    if (editingState.selectedRowKeys.length) {
      const requests = editingState.selectedRowKeys.map(rowId =>
        GSPBackend.delete(`/${selectedTable}s/${rowId}`),
      );
      await Promise.all(requests);
      setTableState({
        ...tableState,
        rows: tableState.rows.filter(row => !editingState.selectedRowKeys.includes(row.id)),
      });
    }
  };

  const saveEdits = async () => {
    if (editingState.editedRows) {
      const requests = Object.keys(editingState.editedRows).map(id =>
        GSPBackend.put(`/${selectedTable}s/${id}`, editingState.editedRows[id]),
      );
      console.log(editingState.editedRows);
      await Promise.all(requests);
      await fetchTableData();
    }
    setEditingMode(false);
  };

  // Load dropdown survey options on page load
  useEffect(async () => {
    const map = await GSPBackend.get('/surveys/manageDataOptions');
    setSurveyOptions([{ label: 'View all data' }, ...map.data]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Changes columns based in if the user is in editing mode
    if (tableState.columns) {
      setTableState({ ...tableState, columns: computeColumnsFromExisting(tableState.columns) });
    }
  }, [editingMode, editingState]);

  // Load table data when selected table or selected survey changes
  useEffect(async () => {
    await fetchTableData();
    setEditingState({ selectedRowKeys: [], editedRows: {} });
  }, [selectedTable, selectedSurveyId]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles['manage-data-container']}>
      <Title>Manage Data</Title>
      <Radio.Group
        defaultValue="survey"
        buttonStyle="solid"
        onChange={e => setSelectedTable(e.target.value)}
      >
        <Radio.Button value="computation">Computations Table</Radio.Button>
        <Radio.Button value="survey">Survey Table</Radio.Button>
        <Radio.Button value="clam">Clam Table</Radio.Button>
        <Radio.Button value="raker">Raker Table</Radio.Button>
      </Radio.Group>
      <br />
      <div className={styles['data-options']}>
        <Cascader
          className={styles.cascader}
          options={surveyOptions}
          placeholder="Select a survey"
          onChange={onSurveyChange}
        />
        {editingMode ? (
          <div className={styles['editing-mode-buttons']}>
            {editingState.selectedRowKeys.length ? (
              <Button className={styles['delete-button']} onClick={deleteSelectedRows}>
                Delete
              </Button>
            ) : (
              <Button className={styles['save-button']} onClick={saveEdits}>
                Save
              </Button>
            )}
            <Button className={styles['cancel-button']} onClick={cancelEditingMode}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditingMode(true)}>Edit {selectedTable} data</Button>
        )}
      </div>
      <div className={styles['table-container']}>
        <Table
          rowSelection={editingMode ? rowSelection : undefined}
          bordered
          columns={tableState.columns}
          dataSource={tableState.rows}
          scroll={{ x: true }}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default ManageData;
