import React from 'react';
import PropTypes from 'prop-types';
import { Table, Space, Button } from 'antd';

const QueryResults = ({ data }) => {
  const columns = [
    { title: 'Survey ID', dataIndex: 'survey_id', key: 'survey_id' },
    { title: 'Raker ID', dataIndex: 'raker_id', key: 'raker_id' },
    { title: 'Clam ID', dataIndex: 'clam_id', key: 'clam_id' },
    {
      title: '',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        rowKey={record => [record.survey_id, record.raker_id, record.clam_id]}
        dataSource={data}
        columns={columns}
      />
    </div>
  );
};

QueryResults.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object()).isRequired,
};

export default QueryResults;
