/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Space, Button } from 'antd';
import { TABLE_PRIMARY_KEYS } from '../ManageDataUtils';

import styles from './QueryResults.module.css';

const computeColumns = data => {
  if (data.length === 0 || data[0].length <= TABLE_PRIMARY_KEYS.length) {
    return [{}];
  }
  const cols = Object.keys(data[0]).filter(value => !TABLE_PRIMARY_KEYS.includes(value));

  const actionColumn = {
    title: '',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button>Edit</Button>
        <Button danger>Delete</Button>
      </Space>
    ),
  };
  return [
    ...cols.map(field => ({
      title: field,
      dataIndex: field,
      key: field,
    })),
    actionColumn,
  ];
};

const QueryResults = ({ data }) => {
  return (
    <div className={styles['query-results-container']}>
      <Table
        rowKey={record => {
          return TABLE_PRIMARY_KEYS.map(value => record[value]);
        }}
        dataSource={data}
        columns={computeColumns(data)}
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
