/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useEffect } from 'react';
import { Utils as QbUtils, Query, Builder, AntdConfig } from '@react-awesome-query-builder/antd';
import { Button } from 'antd';
import { GSPBackend } from '../../utils/auth_utils';
import '@react-awesome-query-builder/antd/css/styles.css';

import SelectAttributesModal from './SelectAttributesModal/SelectAttributesModal';
import QueryResults from './QueryResults/QueryResults';
import './QueryData.module.css';

const config = {
  ...AntdConfig,
  fields: {},
};

const queryValue = { id: QbUtils.uuid(), type: 'group' };

const QueryData = () => {
  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config,
    results: [{ survey_id: 1, clam_id: 1, raker_id: 1 }],
  });

  const [isSelectAttributesModalOpen, setIsSelectedAttributesModalOpen] = useState(false);

  const onChange = useCallback((immutableTree, changeConfig) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState(prevState => ({ ...prevState, tree: immutableTree, config: changeConfig }));
  }, []);

  const onAdvancedSearch = async () => {
    const { tree: immutableTree, config: immutableConfig } = state;
    const results = await GSPBackend.post('/query/advanced', {
      tree: QbUtils.getTree(immutableTree),
      config: immutableConfig,
    });
    console.log(results);
    setState(prevState => ({ ...prevState, results: results.data }));
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
  useEffect(() => {
    // Get all the tables
    // Get all the columns for each table
  }, []);

  return (
    <div className="query-data-container">
      <h1>Query Data</h1>
      <Query {...config} value={state.tree} onChange={onChange} renderBuilder={renderBuilder} />
      <Button onClick={onAdvancedSearch}>Search</Button>
      <SelectAttributesModal
        isOpen={isSelectAttributesModalOpen}
        setIsOpen={setIsSelectedAttributesModalOpen}
      />
      <h2>Query Results</h2>
      <Button>Export as CSV</Button>
      <Button type="primary" onClick={() => setIsSelectedAttributesModalOpen(true)}>
        Select Attributes
      </Button>
      <QueryResults data={state.results} />
    </div>
  );
};

export default QueryData;
