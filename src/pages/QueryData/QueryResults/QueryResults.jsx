/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Space, Button } from 'antd';
import LoadingScreen from '../../../common/LoadingScreen/LoadingScreen';
import { TABLE_PRIMARY_KEYS } from '../QueryDataUtils';

import styles from './QueryResults.module.css';

const computeColumns = (checkedLists, data) => {
  // if no data, use checkedLists to determine column names
  if (data.length === 0 || data[0].length <= TABLE_PRIMARY_KEYS.length) {
    return Object.keys(checkedLists)
      .map(table => {
        return checkedLists[table].map(field => ({
          title: `${field} (${table})`,
          dataIndex: field,
          key: field,
        }));
      })
      .flat();
  }

  const cols = Object.keys(data[0]).filter(value => !TABLE_PRIMARY_KEYS.includes(value));
  return [
    ...cols.map(field => ({
      title: field,
      dataIndex: field,
      key: field,
    })),
  ];
};

const QueryResults = ({ checkedLists, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles['query-results-container']}>
        <LoadingScreen />
      </div>
    );
  }
  return (
    <div className={styles['query-results-container']}>
      <Table
        rowKey={record => {
          return TABLE_PRIMARY_KEYS.map(value => record[value]);
        }}
        dataSource={data}
        columns={computeColumns(checkedLists, data)}
        scroll={{ x: true }}
        size="middle"
      />
    </div>
  );
};

QueryResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default QueryResults;
