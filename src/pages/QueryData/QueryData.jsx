/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import { Utils as QbUtils, Query, Builder, AntdConfig } from '@react-awesome-query-builder/antd';
import { Alert, Button, Input, Radio, Typography } from 'antd';
import '@react-awesome-query-builder/antd/css/styles.css';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import SelectAttributesModal from './SelectAttributesModal/SelectAttributesModal';
import SelectTablesModal from './SelectTablesModal/SelectTablesModal';
import QueryResults from './QueryResults/QueryResults';
import { tableToWidget } from './QueryDataUtils';
import { GSPBackend } from '../../utils/utils';

import styles from './QueryData.module.css';
// Used ONLY to overrule default styling of react-awesome-query-builder
import './QueryData.css';

const { Title, Text } = Typography;

class DefaultDict {
  constructor(DefaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof DefaultInit === 'function' ? new DefaultInit().valueOf() : DefaultInit),
      },
    );
  }
}

const queryValue = { id: QbUtils.uuid(), type: 'group' };

const QueryData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [genericSearch, setGenericSearch] = useState(true);
  const [config, setConfig] = useState({ ...AntdConfig, fields: {} });
  const [tableState, setTableState] = useState({
    tableNames: [],
    columnInfo: [],
  });
  const [queryState, setQueryState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config,
    genericSearchQuery: '',
    queryResultsLoading: false,
    results: [],
  });
  const [errorState, setErrorState] = useState('');
  const [checkedLists, setCheckedLists] = useState(new DefaultDict(Array));
  const [checkedTables, setCheckedTables] = useState(new Set());

  const [isSelectAttributesModalOpen, setIsSelectedAttributesModalOpen] = useState(false);
  const [isSelectedTablesModalOpen, setIsSelectedTablesModalOpen] = useState(false);

  const onChange = useCallback((immutableTree, changeConfig) => {
    setQueryState(prevState => ({ ...prevState, tree: immutableTree, config: changeConfig }));
  }, []);

  const onSelectSearch = e => {
    if (e.target.value == 'generic') {
      setGenericSearch(true);
    } else if (e.target.value == 'advanced') {
      setGenericSearch(false);
    }
  };

  const onAdvancedSearch = async () => {
    // only query if checkedLists is nonempty
    if (Object.values(checkedLists).every(arr => arr.length === 0)) {
      setErrorState('Please select at least one column to display');
      return;
    }
    setErrorState('');

    // get rid of prev. results (find more elegant way to do this?)
    setQueryState(prevState => ({ ...prevState, queryResultsLoading: true }));

    // get current state and make query
    try {
      const { tree: immutableTree, config: immutableConfig } = queryState;
      const results = await GSPBackend.post('/query/advanced', {
        jsonLogic: QbUtils.jsonLogicFormat(immutableTree, config).logic,
        config: immutableConfig,
        checkedFields: checkedLists,
      });

      setQueryState(prevState => ({
        ...prevState,
        results: results.data,
        queryResultsLoading: false,
      }));
    } catch (err) {
      setErrorState(`${err.name}: ${err.message}`);
      setQueryState(prevState => ({ ...prevState, queryResultsLoading: false }));
      throw err;
    }
  };

  const onGenericSearch = async () => {
    if (!queryState.genericSearchQuery.length) {
      setErrorState('Please enter a search query');
      return;
    } else if (!checkedTables.length) {
      setErrorState('Please select at least one table to query');
      return;
    }
    setErrorState('');

    // get rid of prev. results (find more elegant way to do this?)
    setQueryState(prevState => ({
      ...prevState,
      genericSearchQuery: queryState.genericSearchQuery,
      results: [],
      queryResultsLoading: true,
    }));

    // get current state and make query
    try {
      const results = await GSPBackend.post('/query/generic', {
        query: queryState.genericSearchQuery,
        checkedTables,
      });
      setQueryState(prevState => ({
        ...prevState,
        results: results.data,
        queryResultsLoading: false,
      }));
    } catch (err) {
      setErrorState(`${err.name}: ${err.message}`);
      setQueryState(prevState => ({ ...prevState, queryResultsLoading: false }));
    }
  };

  const renderBuilder = useCallback(props => <Builder {...props} />, []);

  // Build the config fields on page load
  useEffect(async () => {
    // Get all the tables
    const response = await GSPBackend.get('/tables');
    const tableNames = response.data;

    // Get all the columns for each table
    const columnInfoRequests = tableNames.map(tableName =>
      GSPBackend.get(`/tables/${tableName}/columns`),
    );
    const columnInfo = (await Promise.all(columnInfoRequests)).map(
      columnInfoResponse => columnInfoResponse.data,
    );

    // build configs and set states accordingly
    setConfig({
      ...config,
      fields: Object.fromEntries(
        tableNames.map((tableName, index) => [
          tableName,
          tableToWidget(tableName, columnInfo[index]),
        ]),
      ),
    });
    setTableState({ tableNames, columnInfo });
    setIsLoading(false);
  }, []);

  const onSelectButtonClicked = () => {
    if (genericSearch) {
      setIsSelectedTablesModalOpen(true);
    } else {
      setIsSelectedAttributesModalOpen(true);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles['query-data-container']}>
      <h1>Query Data</h1>
      <Radio.Group
        onChange={onSelectSearch}
        defaultValue="generic"
        className={styles['search-type-selector']}
      >
        <Radio.Button value="generic">Generic Search</Radio.Button>
        <Radio.Button value="advanced">Advanced Search</Radio.Button>
      </Radio.Group>
      {genericSearch ? (
        <div className={styles['generic-query']}>
          <Input
            value={queryState.genericSearchQuery}
            onChange={e => setQueryState({ ...queryState, genericSearchQuery: e.target.value })}
            placeholder="Input search text..."
            className={styles['generic-search-bar']}
            onPressEnter={onGenericSearch}
          />
          <div className={styles['search-config-buttons']}>
            <Button type="primary" onClick={onSelectButtonClicked}>
              {genericSearch ? 'Select tables to search' : 'Select columns to display'}
            </Button>
            <Button
              type="primary"
              onClick={onGenericSearch}
              className={styles['advanced-query-button']}
            >
              Query
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles['advanced-query']}>
          <Query
            {...config}
            value={queryState.tree}
            onChange={onChange}
            renderBuilder={renderBuilder}
            className={styles['query-builder']}
          />
          <div className={styles['search-config-buttons']}>
            <Button type="primary" onClick={onSelectButtonClicked}>
              {genericSearch ? 'Select tables to search' : 'Select columns to display'}
            </Button>
            <Button
              type="primary"
              onClick={onAdvancedSearch}
              className={styles['advanced-query-button']}
            >
              Query
            </Button>
          </div>
        </div>
      )}
      <SelectTablesModal
        tableState={tableState}
        isOpen={isSelectedTablesModalOpen}
        setIsOpen={setIsSelectedTablesModalOpen}
        checkedTables={checkedTables}
        setCheckedTables={setCheckedTables}
      />
      <SelectAttributesModal
        tableState={tableState}
        isOpen={isSelectAttributesModalOpen}
        setIsOpen={setIsSelectedAttributesModalOpen}
        checkedLists={checkedLists}
        setCheckedLists={setCheckedLists}
      />
      <div className={styles['query-results-header']}>
        <Title level={2}>
          Query Results <Text>({queryState.results.length} rows returned)</Text>
        </Title>
        <Button>Export data</Button>
      </div>
      {
        // temporary error banner
        errorState !== '' && <Alert message={errorState} type="error" showIcon />
      }
      <QueryResults
        checkedLists={checkedLists}
        data={queryState.results}
        isLoading={queryState.queryResultsLoading}
        query={queryState.genericSearchQuery}
      />
    </div>
  );
};

export default QueryData;
