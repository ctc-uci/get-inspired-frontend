import React, { useState, useEffect } from 'react';
import { Radio, Cascader, Table, Typography, Button } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import DeleteDataModal from './DeleteDataModal/DeleteDataModal';
import EditDataModal from './EditDataModal/EditDataModal';
import CancelModal from './CancelModal/CancelModal';

import { EditableCell, UndoButton } from './ManageDataUtils';
import { humanizeCell } from '../QueryData/QueryDataUtils';
import { GSPBackend } from '../../utils/utils';
import styles from './ManageData.module.css';

const { Title } = Typography;

const PAGE_SIZE = 10;
const ManageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('survey');
  const [editingMode, setEditingMode] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState([]);

  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [editingState, setEditingState] = useState({
    selectedRowKeys: [],
    editedRows: {},
  });

  const [tableState, setTableState] = useState({ originalRows: [], rows: [], columns: [] });

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
      title: col.COLUMN_NAME,
      key: col.COLUMN_NAME,
      dataIndex: col.COLUMN_NAME,
      type: col.DATA_TYPE,
    }));

  // Creates columns for table based on existing columns (switches to input if in editing mode)
  const computeColumnsFromExisting = columnData => [
    ...columnData
      .filter(col => col.key !== 'operation')
      .map(col => ({
        ...col,
        render: (text, record, index) =>
          col.title !== 'id' && col.title !== 'survey_id' && editingMode ? (
            <EditableCell
              originalRecord={tableState.originalRows[index + (page - 1) * PAGE_SIZE]}
              record={record}
              index={index + (page - 1) * PAGE_SIZE}
              columnName={col.title}
              columnType={col.type}
              editingState={editingState}
              setEditingState={setEditingState}
              tableState={tableState}
              setTableState={setTableState}
            />
          ) : (
            <div>{humanizeCell(text, col.type)}</div>
          ),
      })),
    ...(editingMode
      ? [
          {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => (
              <UndoButton
                originalRecord={tableState.originalRows[index + (page - 1) * PAGE_SIZE]}
                index={index + (page - 1) * PAGE_SIZE}
                tableState={tableState}
                setTableState={setTableState}
                editingState={editingState}
                setEditingState={setEditingState}
              />
            ),
          },
        ]
      : []),
  ];

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
      originalRows: rowData.map(row => ({ ...row })),
      rows: rowData,
      columns: computeColumnsFromSQL(columnData),
    });
  };

  const cancelButtonClicked = () => {
    // If there are edited rows, open the cancel modal
    if (Object.keys(editingState.editedRows).length) {
      setIsCancelModalOpen(true);
      // Otherwise, exit editing mode
    } else {
      setEditingMode(false);
    }
  };

  const saveButtonClicked = () => {
    // If there are edited rows, open the edit data modal
    if (Object.keys(editingState.editedRows).length) {
      setIsEditDataModalOpen(true);
      // Otherwise, exit editing mode
    } else {
      setEditingMode(false);
    }
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
      setEditingState({
        editedRows: Object.fromEntries(
          Object.entries(editingState.editedRows).filter(
            ([key]) => !editingState.selectedRowKeys.includes(Number.parseInt(key, 10)),
          ),
        ),
        selectedRowKeys: [],
      });
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
    const map = await GSPBackend.get('/surveys/existingSurveyOptions');
    setSurveyOptions([{ label: 'View all data' }, ...map.data]);
    setIsLoading(false);
  }, []);

  // Clear the editing state every time editingMode is toggled
  useEffect(async () => {
    if (!editingMode) {
      await fetchTableData();
    }
    setEditingState({ selectedRowKeys: [], editedRows: {} });
  }, [editingMode]);

  useEffect(() => {
    // Re-renders table columns -- needed because antd only computes column state based on state values when a column is rendered
    if (tableState.columns) {
      setTableState({ ...tableState, columns: computeColumnsFromExisting(tableState.columns) });
    }
  }, [editingMode, editingState, tableState.rows, page]);

  // Load table data when selected table or selected survey changes
  useEffect(async () => {
    await fetchTableData();
  }, [selectedTable, selectedSurveyId]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles['manage-data-container']}>
      <Title>Manage Data</Title>
      <Radio.Group
        value={selectedTable}
        buttonStyle="solid"
        onChange={e => setSelectedTable(e.target.value)}
        disabled={editingMode}
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
          disabled={editingMode}
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
              <Button className={styles['save-button']} onClick={saveButtonClicked}>
                Save
              </Button>
            )}
            <Button className={styles['cancel-button']} onClick={cancelButtonClicked}>
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
          columns={[...tableState.columns]}
          dataSource={[...tableState.rows]}
          scroll={{ x: true }}
          pagination={{
            current: page,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: value => setPage(value),
          }}
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
      <EditDataModal
        isOpen={isEditDataModalOpen}
        editedRows={editingState.editedRows}
        setIsOpen={setIsEditDataModalOpen}
        selectedRowKeys={editingState.editedRows}
        selectedTable={selectedTable}
        saveEdits={saveEdits}
      />
      <CancelModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        editedRows={editingState.editedRows}
        setEditingMode={setEditingMode}
      />
    </div>
  );
};

export default ManageData;
