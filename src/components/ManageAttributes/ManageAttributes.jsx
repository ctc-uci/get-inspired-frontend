import React, { useState, useEffect } from 'react';
import { Space, Table, Button } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { dataSource, tableViews, adjustDataType } from './ManageAttributesUtils';
import styles from './ManageAttributes.module.css';
import { GSPBackend } from '../../utils/utils';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';

const ManageAttributes = () => {
  const [contentType, setContentType] = useState('t1');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAttributeModalOpen, setIsAddAttributeModalOpen] = useState(false);
  const [curTableName, setCurTableName] = useState('computation');

  const [surveys, setSurveys] = useState([]);
  const [clams, setClams] = useState([]);
  const [rakers, setRakers] = useState([]);

  // Retrieve Table Column Information
  const getTableColsFromDB = async tableName => {
    const res = (await GSPBackend.get(`/tables/${tableName}/columns`)).data.map(id => ({
      ...id,
      attributeName: id.COLUMN_NAME,
      dataType: adjustDataType(id.DATA_TYPE),
    }));
    return res;
  };

  useEffect(async () => {
    // Surveys
    const surveyCols = await getTableColsFromDB('survey');
    setSurveys(surveyCols);

    // Clams
    const clamCols = await getTableColsFromDB('clam');
    setClams(clamCols);

    // Rakers
    const rakerCols = await getTableColsFromDB('raker');
    setRakers(rakerCols);

    setIsLoading(false);
  }, []);

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

  // Tables
  const ComputationsTable = () => (
    <div className={styles.table}>
      {setCurTableName('computation')}
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  const RakerTable = () => (
    <div className={styles.table}>
      {setCurTableName('raker')}
      <Table dataSource={rakers} columns={columns} />
    </div>
  );

  const ClamTable = () => (
    <div className={styles.table}>
      {setCurTableName('clam')}
      <Table dataSource={clams} columns={columns} />
    </div>
  );

  const SurveyTable = () => (
    <div className={styles.table}>
      {setCurTableName('survey')}
      <Table dataSource={surveys} columns={columns} />
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AddAttributeModal
        isOpen={isAddAttributeModalOpen}
        setIsOpen={setIsAddAttributeModalOpen}
        tableName={curTableName}
        getTableColsFromDB={getTableColsFromDB}
      />
      <div className={styles.window}>
        <div>
          <h3 className={styles.title}>Manage Attributes</h3>
          <div>
            <div className={styles.button}>
              {tableViews.map(tableView => (
                <Button
                  className={styles.divider}
                  key={tableView.type}
                  type="primary"
                  onClick={() => setContentType(tableView.type)}
                >
                  {tableView.name} Table
                </Button>
              ))}
            </div>
            <div className={styles.addButton}>
              <Button type="primary" onClick={() => setIsAddAttributeModalOpen(true)}>
                + Add Attribute
              </Button>
            </div>
          </div>
        </div>
        <div>
          {contentType === 't1' && <ComputationsTable />}
          {contentType === 't2' && <SurveyTable />}
          {contentType === 't3' && <ClamTable />}
          {contentType === 't4' && <RakerTable />}
        </div>
      </div>
    </>
  );
};

export default ManageAttributes;
