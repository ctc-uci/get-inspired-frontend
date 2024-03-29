/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import { Utils as QbUtils, Query, Builder, AntdConfig } from '@react-awesome-query-builder/antd';
import { Alert, Button, Input, Radio, Typography } from 'antd';
import { CSVLink } from 'react-csv';
import '@react-awesome-query-builder/antd/css/styles.css';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import SelectAttributesModal from '../../components/QueryData/SelectAttributesModal/SelectAttributesModal';
import SelectTablesModal from '../../components/QueryData/SelectTablesModal/SelectTablesModal';
import QueryResults from '../../components/QueryData/QueryResults/QueryResults';
import { tableToWidget } from './QueryDataUtils';
import { GSPBackend, NotiIcon, NotiMessage, notify } from '../../utils/utils';

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
  const [checkedLists, setCheckedLists] = useState(new DefaultDict(Array));
  const [checkedTables, setCheckedTables] = useState(new Set());

  const [isExportDataModalOpen, setIsExportDataModalOpen] = useState(false);
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
      notify(NotiMessage.ADVANCED_SEARCH_ERROR, NotiIcon.ERROR);
      setIsSelectedAttributesModalOpen(true);
      return;
    }

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
      notify(NotiMessage.QUERY_ERROR, NotiIcon.ERROR);
    }
  };

  const onGenericSearch = async () => {
    if (!checkedTables.length) {
      notify(NotiMessage.GENERIC_SEARCH_ERROR, NotiIcon.ERROR);
      setIsSelectedTablesModalOpen(true);
      return;
    }

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
      notify(NotiMessage.QUERY_ERROR, NotiIcon.ERROR);
    }
  };

  const renderBuilder = useCallback(props => <Builder {...props} />, []);

  // Build the config fields on page load
  useEffect(async () => {
    document.title = 'Query Data - Get Inspired: Pismo Clam Database';
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

  // Reset results when switching between generic and advanced search
  useEffect(() => {
    setQueryState({ ...queryState, genericSearchQuery: '', results: [] });
    setCheckedLists(new DefaultDict(Array));
  }, [genericSearch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles['query-data-container']}>
      <Title>Query Data</Title>
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
        <Title level={2}>Query Results</Title>
        <CSVLink
          filename="data.csv"
          data={queryState.results}
          onClick={e => {
            if (!queryState.results.length) {
              e.preventDefault();
            }
          }}
        >
          <Button disabled={!queryState.results.length}>Download CSV</Button>
        </CSVLink>
      </div>
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
