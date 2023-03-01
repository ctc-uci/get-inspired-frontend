/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import { Utils as QbUtils, Query, Builder, AntdConfig } from '@react-awesome-query-builder/antd';
import { Alert, Button } from 'antd';
import '@react-awesome-query-builder/antd/css/styles.css';

import LoadingScreen from '../../common/LoadingScreen';
import SelectAttributesModal from './SelectAttributesModal/SelectAttributesModal';
import QueryResults from './QueryResults/QueryResults';
import { tableToWidget } from './QueryDataUtils';
import { GSPBackend } from '../../utils/utils';

import styles from './QueryData.module.css';

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
  const [config, setConfig] = useState({ ...AntdConfig, fields: {} });
  const [tableState, setTableState] = useState({
    tableNames: [],
    columnInfo: [],
  });
  const [queryState, setQueryState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config,
    results: [],
  });
  const [errorState, setErrorState] = useState("");
  const [checkedLists, setCheckedLists] = useState(new DefaultDict(Array));

  const [isSelectAttributesModalOpen, setIsSelectedAttributesModalOpen] = useState(false);

  const onChange = useCallback((immutableTree, changeConfig) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setQueryState(prevState => ({ ...prevState, tree: immutableTree, config: changeConfig }));
  }, []);

  const onAdvancedSearch = async () => {
    // only query if checkedLists is nonempty
    if(Object.values(checkedLists).every((arr) => (arr.length === 0))){
      setErrorState("Please select at least one attribute to query");
      return;
    }
    setErrorState("");

    // get rid of prev. results (find more elegant way to do this?)
    setQueryState(prevState => ({ ...prevState, results: [] }));

    // get current state and make query
    try {
      const { tree: immutableTree, config: immutableConfig } = queryState;
      const results = await GSPBackend.post('/query/advanced', {
        jsonLogic: QbUtils.jsonLogicFormat(immutableTree, config).logic,
        config: immutableConfig,
        checkedFields: checkedLists,
      });

      setQueryState(prevState => ({ ...prevState, results: results.data }));
    } catch(err){
      setErrorState(`${err.name}: ${err.message}`);
    }
  };

  const renderBuilder = useCallback(
    props => (
      <div className="query-builder-container" style={{ padding: '10px' }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    ),
    [],
  );

  // Build the config fields on page load
  useEffect(async () => {
    // Get all the tables
    const response = await GSPBackend.get('/tables');
    const tableNames = response.data.map(tableInformation => tableInformation.TABLE_NAME);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles['query-data-container']}>
      <h1>Query Data</h1>
      <Query
        {...config}
        value={queryState.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <Button onClick={onAdvancedSearch}>Search</Button>
      <SelectAttributesModal
        tableState={tableState}
        isOpen={isSelectAttributesModalOpen}
        setIsOpen={setIsSelectedAttributesModalOpen}
        checkedLists={checkedLists}
        setCheckedLists={setCheckedLists}
      />
      <h2>Query Results</h2>
      <Button>Export as CSV</Button>
      <Button type="primary" onClick={() => setIsSelectedAttributesModalOpen(true)}>
        Select Attributes
      </Button>
      {
        // temporary error banner
        (errorState !== "") &&  <Alert message={errorState} type="error" showIcon />
      }
      <QueryResults data={queryState.results} />
    </div>
  );
};

export default QueryData;
