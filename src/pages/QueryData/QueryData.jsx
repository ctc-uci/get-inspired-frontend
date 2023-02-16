/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useEffect } from 'react';

import { Utils as QbUtils, Query, Builder, BasicConfig } from '@react-awesome-query-builder/antd';
import '@react-awesome-query-builder/antd/css/styles.css';

const config = {
  ...BasicConfig,
  fields: {},
};

const queryValue = { id: QbUtils.uuid(), type: 'group' };

const QueryData = () => {
  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config,
  });

  const onChange = useCallback((immutableTree, changeConfig) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState(prevState => ({ ...prevState, tree: immutableTree, config: changeConfig }));

    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    // const jsonTree = QbUtils.getTree(immutableTree);
  }, []);

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
    // Get all the tabless
    // Get all the columns for each table
  }, []);

  return (
    <div>
      <Query {...config} value={state.tree} onChange={onChange} renderBuilder={renderBuilder} />
    </div>
  );
};

export default QueryData;
