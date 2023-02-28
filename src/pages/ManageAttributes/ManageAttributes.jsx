import React, { useState, useEffect } from 'react';
import { Space, Table, Button } from 'antd';

import { GSPBackend } from '../../utils/utils';

const tableViews = [
  { name: 'Computations', type: 't1' },
  { name: 'Survey', type: 't2' },
  { name: 'Clam', type: 't3' },
  { name: 'Raker', type: 't4' },
];

const ManageAttributes = () => {
  const [contentType, setContentType] = useState('t1');

  const [surveys, setSurveys] = useState([]);
  const [clams, setClams] = useState([]);
  const [rakers, setRakers] = useState([]);

  const adjustDataType = typeString => {
    if (typeString === 'int' || typeString === 'double') {
      typeString = 'Numeric';
    } else if (typeString === 'datetime') {
      typeString = 'Datetime';
    } else if (typeString === 'boolean') {
      typeString = 'Boolean';
    } else {
      typeString = 'Text';
    }

    return typeString;
  };

  // Surveys
  const getSurveyColsFromDB = async () => {
    const res = (await GSPBackend.get('/tables/survey/columns')).data.map(id => ({
      ...id,
      attributeName: id.COLUMN_NAME,
      dataType: adjustDataType(id.DATA_TYPE),
    }));
    return res;
  };

  const getAllSurveys = async () => {
    const surveyCols = await getSurveyColsFromDB();
    setSurveys(surveyCols);
  };

  useEffect(() => {
    getAllSurveys();
  }, []);

  // Clams
  const getClamsColsFromDB = async () => {
    const res = (await GSPBackend.get('/tables/clam/columns')).data.map(id => ({
      ...id,
      attributeName: id.COLUMN_NAME,
      dataType: adjustDataType(id.DATA_TYPE),
    }));
    return res;
  };

  const getAllClams = async () => {
    const clamCols = await getClamsColsFromDB();
    setClams(clamCols);
  };

  useEffect(() => {
    getAllClams();
  }, []);

  // Rakers
  const getRakerColsFromDB = async () => {
    const res = (await GSPBackend.get('/tables/raker/columns')).data.map(id => ({
      ...id,
      attributeName: id.COLUMN_NAME,
      dataType: adjustDataType(id.DATA_TYPE),
    }));
    return res;
  };

  const getAllRakers = async () => {
    const rakerCols = await getRakerColsFromDB();
    setRakers(rakerCols);
  };

  useEffect(() => {
    getAllRakers();
  }, []);

  // Temporary Data for Computations Table
  const dataSource = [
    {
      key: '1',
      attributeName: 'People',
      dataType: 'Number',
    },
    {
      key: '2',
      attributeName: 'Comments',
      dataType: 'Text',
    },
  ];

  // Columns for table
  const columns = [
    {
      title: 'Attribute Name',
      dataIndex: 'attributeName',
      key: 'attributeName',
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Edit</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Delete</a>
        </Space>
      ),
    },
  ];

  const ComputationsTable = () => (
    <div>
      <h1>Computations Table</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  const RakerTable = () => (
    <div>
      <h1>Raker Table</h1>
      <Table dataSource={rakers} columns={columns} />
    </div>
  );

  const ClamTable = () => (
    <div>
      <h1>Clam Table</h1>
      <Table dataSource={clams} columns={columns} rowKey="id" />
    </div>
  );

  const SurveyTable = () => (
    <div>
      <h1>Survey Table</h1>
      <Table dataSource={surveys} columns={columns} />
    </div>
  );

  return (
    <div>
      <div>
        <h1>Manage Attributes</h1>
        {tableViews.map(tableView => (
          <Button
            key={tableView.type}
            type="primary"
            onClick={() => setContentType(tableView.type)}
          >
            {tableView.name} Table
          </Button>
        ))}
      </div>
      <div>
        {contentType === 't1' && <ComputationsTable />}
        {contentType === 't2' && <SurveyTable />}
        {contentType === 't3' && <ClamTable />}
        {contentType === 't4' && <RakerTable />}
      </div>
    </div>
  );
};

export default ManageAttributes;
