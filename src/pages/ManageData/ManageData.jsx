import React, { useState, useEffect } from 'react';
import { Radio, Cascader, Table } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import { GSPBackend, keysToCamel, toCamel } from '../../utils/utils';
import styles from './ManageData.module.css';

const ManageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('survey');
  const [tableState, setTableState] = useState({ rows: [], columns: [] });
  const [options, setOptions] = useState({});

  const computeColumns = columnData =>
    columnData.map(col => ({
      title: toCamel(col.COLUMN_NAME),
      key: toCamel(col.COLUMN_NAME),
      dataIndex: toCamel(col.COLUMN_NAME),
    }));

  const onSurveyChange = ([, surveyId]) => {
    setSelectedSurveyId(surveyId);
  };

  // Load dropdown survey options on page load
  useEffect(async () => {
    const map = await GSPBackend.get('/surveys/manageDataOptions');
    setOptions([{ label: 'View all data' }, ...map.data]);
    setIsLoading(false);
  }, []);

  // Load table data when selected table or selected survey changes
  useEffect(async () => {
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
      columns: computeColumns(columnData),
    });
  }, [selectedTable, selectedSurveyId]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles['manage-data-container']}>
      <h1>Manage Data</h1>
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
      <div className={styles['select-survey-options']}>
        <Cascader
          className={styles.cascader}
          options={options}
          placeholder="Select a survey"
          onChange={onSurveyChange}
        />
      </div>
      <div className={styles['table-container']}>
        <Table
          bordered
          columns={tableState.columns}
          dataSource={tableState.rows}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};

export default ManageData;
