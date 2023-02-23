/* eslint-disable */
import React from 'react';
// import PropTypes from 'prop-types';
import { Table, Space, Button } from 'antd';

const computeColumns = data => {
  if (data.length === 0 || Object.keys(data[0]).length === 0) {
    return [{}];
  }

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
    ...Object.keys(data[0]).map(field => ({
      title: field,
      dataIndex: field,
      key: field,
    })),
    actionColumn,
  ];
};

const QueryResults = ({ data }) => {
  // const columns = [
  //   { title: 'Survey ID', dataIndex: 'survey_id', key: 'survey_id' },
  //   { title: 'Raker ID', dataIndex: 'raker_id', key: 'raker_id' },
  //   { title: 'Clam ID', dataIndex: 'clam_id', key: 'clam_id' },
  //   {
  //     title: '',
  //     key: 'action',
  //     render: () => (
  //       <Space size="middle">
  //         <Button>Edit</Button>
  //         <Button danger>Delete</Button>
  //       </Space>
  //     ),
  //   },
  // ];

  console.log({ data, cols: computeColumns(data) });

  return (
    <div>
      <Table
        rowKey={record => [record.survey_id, record.raker_id, record.clam_id]}
        dataSource={data}
        columns={computeColumns(data)}
      />
    </div>
  );
};

// QueryResults.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.object()).isRequired,
// };

export default QueryResults;
