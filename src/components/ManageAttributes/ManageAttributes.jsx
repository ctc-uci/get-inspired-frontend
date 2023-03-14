import React, { useState, useEffect } from 'react';
import { Space, Table, Button } from 'antd';

import styles from './ManageAttributes.module.css';
import { GSPBackend } from '../../utils/utils';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';
import EditAttributeModal from './EditAttributesModal/EditAttributeModal';
import DeleteAttributesModal from './DeleteAttributesModal/DeleteAttributesModal';

const tableViews = [
  { name: 'Computations', type: 't1' },
  { name: 'Survey', type: 't2' },
  { name: 'Clam', type: 't3' },
  { name: 'Raker', type: 't4' },
];

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

const ManageAttributes = () => {
  const [isAddAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] = useState(false);
  const [isDeleteAttributeModalOpen, setIsDeleteAttributeModalOpen] = useState(false);
  const [attributeNameToEdit, setAttributeNameToEdit] = useState('');
  const [contentType, setContentType] = useState('t1');

  const [surveys, setSurveys] = useState([]);
  const [clams, setClams] = useState([]);
  const [rakers, setRakers] = useState([]);

  const editAttributeLabelClicked = id => {
    setAttributeNameToEdit(id);
    setIsEditAttributeModalOpen(true);
  };

  const deleteAttributeButtonClicked = id => {
    setAttributeNameToEdit(id);
    setIsDeleteAttributeModalOpen(true);
  };
  // Retrieve Table Column Information
  const getTableColsFromDB = async tableName => {
    const res = (await GSPBackend.get(`/tables/${tableName}/columns`)).data.map(id => ({
      ...id,
      attributeName: id.COLUMN_NAME,
      // eslint-disable-next-line no-use-before-define
      dataType: adjustDataType(id.DATA_TYPE),
    }));
    return res;
  };

  const adjustDataType = typeString => {
    let adjustString = '';

    if (typeString === 'int' || typeString === 'double' || typeString === 'decimal') {
      adjustString = 'Number';
    } else if (typeString === 'datetime') {
      adjustString = 'Datetime';
    } else if (typeString === 'boolean' || typeString === 'tinyint') {
      adjustString = 'Boolean';
    } else {
      adjustString = 'Text';
    }

    return adjustString;
  };

  // Surveys
  const getAllSurveys = async () => {
    const surveyCols = await getTableColsFromDB('survey');
    setSurveys(surveyCols);
  };

  // Clams
  const getAllClams = async () => {
    const clamCols = await getTableColsFromDB('clam');
    setClams(clamCols);
  };

  // Rakers
  const getAllRakers = async () => {
    const rakerCols = await getTableColsFromDB('raker');
    setRakers(rakerCols);
  };

  useEffect(() => {
    getAllClams();
    getAllSurveys();
    getAllRakers();
  }, [isAddAttributeModalOpen, isDeleteAttributeModalOpen, isEditAttributeModalOpen]);

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
          <a href="#" onClick={() => editAttributeLabelClicked(record.attributeName)}>
            Edit
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" onClick={() => deleteAttributeButtonClicked(record.attributeName)}>
            Delete
          </a>
        </Space>
      ),
    },
  ];

  // Tables
  const ComputationsTable = () => (
    <div className={styles.table}>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );

  const RakerTable = () => (
    <div className={styles.table}>
      <Table dataSource={rakers} columns={columns} />
    </div>
  );

  const ClamTable = () => (
    <div className={styles.table}>
      <Table dataSource={clams} columns={columns} />
    </div>
  );

  const SurveyTable = () => (
    <div className={styles.table}>
      <Table dataSource={surveys} columns={columns} />
    </div>
  );

  return (
    <>
      <AddAttributeModal
        isOpen={isAddAttributeModalOpen}
        setIsOpen={setIsAttributeModalOpen}
        tableName={tableViews.filter(tableView => tableView.type === contentType)[0].name}
        // tableName={tableViews.filter(tableView => tableView.type === contentType)[0].name} // need to soomehow get current table name.
        // do i need to also pass in the get all thing for tables.
      />
      <EditAttributeModal
        isOpen={isEditAttributeModalOpen}
        setIsOpen={setIsEditAttributeModalOpen}
        tableName={tableViews.filter(tableView => tableView.type === contentType)[0].name}
        columnName={attributeNameToEdit}
      />
      <DeleteAttributesModal
        isOpen={isDeleteAttributeModalOpen}
        setIsOpen={setIsDeleteAttributeModalOpen}
        tableName={tableViews.filter(tableView => tableView.type === contentType)[0].name}
        columnName={attributeNameToEdit}
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
              <form>
                <Button
                  key="add-attribute"
                  type="primary"
                  onClick={() => setIsAttributeModalOpen(true)}
                >
                  + Add Attribute
                </Button>
              </form>
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
