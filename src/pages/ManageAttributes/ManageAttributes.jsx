import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import axios from 'axios';

const tableViews = [
  {name: "Computations", type: "t1"},
  {name: "Survey", type: "t2"},
  {name: "Clam", type: "t3"},
  {name: "Raker", type: "t4"}
];

const ManageAttributes = () => {
  const [contentType, setContentType] = useState("t1");

  const [clams, getClams] = useState([]);

  const url = 'http://localhost:3001/';

  useEffect(() => {
    getAllClams();
  }, [])

  const getAllClams = () => {
    console.log("running get");
    axios.get('http://localhost:3001/clams')
    .then((response) => {
      const allClams = response.data;
      console.log(allClams);
      getClams(allClams);
    })
    .catch(error => console.error(`Error: ${error}`));
  }

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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
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
      <Table dataSource={dataSource} columns={columns} />
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  const ClamTable = () => (
    <div>
      <h1>Clam Table</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  const SurveyTable = () => (
    <div>
      <h1>Survey Table</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  return (
    <div>
      <div>
      <h1>Manage Attributes</h1>
        {tableViews.map((tableView) => (
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
        {contentType === "t1" && <ComputationsTable />}
        {contentType === "t2" && <SurveyTable />}
        {contentType === "t3" && <ClamTable />}
        {contentType === "t4" && <RakerTable />}
      </div>
      {console.log('end')};
    </div>
  );
};

export default ManageAttributes;
