import React, { useState, useEffect } from 'react';
import { Radio, Cascader, Table, Typography, Button } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import DeleteDataModal from './DeleteDataModal/DeleteDataModal';
import { EditableCell } from './ManageDataUtils';
import { humanizeCell } from '../QueryData/QueryDataUtils';
import { GSPBackend, keysToCamel, toCamel } from '../../utils/utils';
import styles from './ManageData.module.css';

const { Title } = Typography;

const ManageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('survey');
  const [editingMode, setEditingMode] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState([]);

  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);

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
      render: (text, record) =>
        col.title !== 'id' && col.title !== 'survey_id' && editingMode ? (
          <EditableCell
            record={record}
            columnName={col.title}
            columnType={col.type}
            defaultValue={text}
            editingState={editingState}
            setEditingState={setEditingState}
          />
        ) : (
          <div>{humanizeCell(text, col.type)}</div>
        ),
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
      rows: keysToCamel(rowData),
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
      setEditingState({ ...editingState, selectedRowKeys: [] });
    }
  };

  const saveEdits = async () => {
    if (editingState.editedRows) {
      const requests = Object.keys(editingState.editedRows).map(id =>
        GSPBackend.put(`/${selectedTable}s/${id}`, editingState.editedRows[id]),
      );
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
              <Button
                className={styles['delete-button']}
                onClick={() => setIsDeleteDataModalOpen(true)}
              >
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
      <DeleteDataModal
        isOpen={isDeleteDataModalOpen}
        setIsOpen={setIsDeleteDataModalOpen}
        selectedTable={selectedTable}
        selectedRowKeys={editingState.selectedRowKeys}
        deleteSelectedRows={deleteSelectedRows}
      />
    </div>
  );
};

export default ManageData;
