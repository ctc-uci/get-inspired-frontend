import React, { useState, useEffect } from 'react';
import { Radio, Cascader, Table, Typography, Button } from 'antd';

import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import DeleteDataModal from '../../components/ManageData/DeleteDataModal/DeleteDataModal';
import EditDataModal from '../../components/ManageData/EditDataModal/EditDataModal';
import CancelModal from '../../components/ManageData/CancelModal/CancelModal';

import { EditableCell, UndoButton } from './ManageDataUtils';
import {
  getSorterCompareFn,
  GSPBackend,
  TABLE_PRIMARY_KEYS,
  humanizeCell,
} from '../../utils/utils';
import { useAuthContext } from '../../common/AuthContext';
import styles from './ManageData.module.css';

const { Title } = Typography;

const PAGE_SIZE = 10;

const ManageData = () => {
  const routeLocation = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('computation');
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
  const { currentUser } = useAuthContext();

  const onSurveyChange = ([newYear, surveyId]) => {
    setYear(newYear);
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
      sorter: getSorterCompareFn(col.COLUMN_NAME),
      sortDirections: ['ascend', 'descend'],
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
              text={text}
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
      rows: rowData.map(row => ({ ...row, key: row[TABLE_PRIMARY_KEYS[selectedTable]] })),
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
      const queryParams = editingState.selectedRowKeys.join(',');
      await GSPBackend.delete(`/${selectedTable}s/?ids=${queryParams}`);

      setTableState({
        ...tableState,
        rows: tableState.rows.filter(row => !editingState.selectedRowKeys.includes(row.id)),
      });

      // (andrew): previous code for behavior to allow for continued edits after deleting was replaced
      //    in favor of code that exits editing mode: swap the two if the behavior should be modified
      setEditingMode(false);
      // setEditingState({
      //   editedRows: Object.fromEntries(
      //     Object.entries(editingState.editedRows).filter(
      //       ([key]) => !editingState.selectedRowKeys.includes(Number.parseInt(key, 10)),
      //     ),
      //   ),
      //   selectedRowKeys: [],
      // });
    }
  };

  const saveEdits = async () => {
    if (editingState.editedRows) {
      await GSPBackend.put(`/${selectedTable}s/`, editingState.editedRows);
      await fetchTableData();
    }
    setEditingMode(false);
  };

  // Load dropdown survey options on page load
  useEffect(async () => {
    document.title = 'Manage Data - Get Inspired: Pismo Clam Database';
    const map = await GSPBackend.get('/surveys/existingSurveyOptions');
    setSurveyOptions(map.data);

    if (routeLocation.state && routeLocation.state.year && routeLocation.state.surveyId) {
      const { year: initYear, surveyId: initSurveyId } = routeLocation.state;
      onSurveyChange([initYear, initSurveyId]);
    }

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
    if (tableState.rows && tableState.columns) {
      setTableState({ ...tableState, columns: computeColumnsFromExisting(tableState.columns) });
    }
  }, [page, editingMode, editingState, tableState.rows]);

  // Load table data when selected table or selected survey changes
  useEffect(async () => {
    setIsTableLoading(true);
    await fetchTableData();
    setPage(1);
    setIsTableLoading(false);
  }, [selectedTable, selectedSurveyId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentUser?.role === 'admin') {
    return (
      <div className={styles['manage-data-container']}>
        <Title>Manage Data</Title>
        <Radio.Group
          value={selectedTable}
          buttonStyle="solid"
          onChange={e => setSelectedTable(e.target.value)}
          disabled={editingMode}
        >
          <Radio.Button value="computation">Computation Table</Radio.Button>
          <Radio.Button value="survey">Survey Table</Radio.Button>
          <Radio.Button value="clam">Clam Table</Radio.Button>
          <Radio.Button value="raker">Raker Table</Radio.Button>
        </Radio.Group>
        <br />
        <div className={styles['data-options']}>
          <div className={styles['left-options']}>
            <Cascader
              className={styles.cascader}
              options={surveyOptions}
              placeholder="Select a survey"
              onChange={onSurveyChange}
              disabled={editingMode}
              defaultValue={
                routeLocation.state && routeLocation.state.year && routeLocation.state.surveyId
                  ? [routeLocation.state.year, routeLocation.state.surveyId]
                  : null
              }
              value={year && selectedSurveyId ? [year, selectedSurveyId] : []}
            />
            <Button onClick={() => setSelectedSurveyId(null)}>View all data</Button>
          </div>
          {editingMode ? (
            <div className={styles['editing-mode-buttons']}>
              {editingState.selectedRowKeys.length ? (
                <Button
                  danger
                  className={styles['delete-button']}
                  type="primary"
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
            <Button onClick={() => setEditingMode(true)} disabled={selectedTable === 'computation'}>
              Edit {selectedTable} data
            </Button>
          )}
        </div>
        <div className={styles['table-container']}>
          <Table
            rowSelection={editingMode ? rowSelection : undefined}
            bordered
            columns={[...tableState.columns]}
            dataSource={[...tableState.rows]}
            scroll={{ x: true }}
            loading={isTableLoading}
            pagination={{
              current: page,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: pageNum => {
                setIsTableLoading(true);
                setPage(pageNum);
                setIsTableLoading(false);
              },
            }}
            rowKey="key"
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
  }

  // Intern View
  return (
    <div className={styles['manage-data-container']}>
      <Title>Manage Data</Title>

      <Radio.Group
        value={selectedTable}
        buttonStyle="solid"
        onChange={e => setSelectedTable(e.target.value)}
        disabled={editingMode}
      >
        <Radio.Button value="computation">Computation Table</Radio.Button>
        <Radio.Button value="survey">Survey Table</Radio.Button>
        <Radio.Button value="clam">Clam Table</Radio.Button>
        <Radio.Button value="raker">Raker Table</Radio.Button>
      </Radio.Group>
      <br />
      <div className={styles['data-options']}>
        <div className={styles['left-options']}>
          <Cascader
            className={styles.cascader}
            options={surveyOptions}
            placeholder="Select a survey"
            onChange={onSurveyChange}
            disabled={editingMode}
            value={year && selectedSurveyId ? [year, selectedSurveyId] : []}
          />
          <Button onClick={() => setSelectedSurveyId(null)}>View all data</Button>
        </div>
      </div>
      <div className={styles['table-container']}>
        <Table
          rowSelection={editingMode ? rowSelection : undefined}
          bordered
          columns={[...tableState.columns]}
          dataSource={[...tableState.rows]}
          scroll={{ x: true }}
          loading={isTableLoading}
          pagination={{
            current: page,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: pageNum => {
              setIsTableLoading(true);
              setPage(pageNum);
              setIsTableLoading(false);
            },
          }}
          rowKey="key"
        />
      </div>
    </div>
  );
};

export default ManageData;
