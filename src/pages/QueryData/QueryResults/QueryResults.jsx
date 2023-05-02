/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import LoadingScreen from '../../../common/LoadingScreen/LoadingScreen';
import { TABLE_PRIMARY_KEYS, humanizeCell } from '../QueryDataUtils';

import styles from './QueryResults.module.css';
import { getSorterCompareFn } from '../../../utils/utils';
const computeColumns = (checkedLists, data, query = '') => {
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
  console.log(data[0]);
  return [
    ...cols.map(field => ({
      title: field,
      dataIndex: field,
      key: field,
      sorter: getSorterCompareFn(field),
      sortDirections: ['ascend', 'descend'],
      render: text => {
        return {
          props: {
            style: {
              background:
                query.length && text && text.toString().toLowerCase().includes(query.toLowerCase())
                  ? 'yellow'
                  : 'white',
            },
          },
          children: <div>{humanizeCell(text)}</div>,
        };
      },
    })),
  ];
};

const QueryResults = ({ checkedLists, data, isLoading, query }) => {
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
        pagination={{ showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }}
        rowKey="id"
        dataSource={data}
        columns={computeColumns(checkedLists, data, query)}
        scroll={{ x: true }}
        size="middle"
        bordered
      />
    </div>
  );
};

QueryResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default QueryResults;
