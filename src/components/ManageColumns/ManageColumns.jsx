import React, { useState, useEffect } from 'react';
import { Radio, Space, Table, Button, Typography } from 'antd';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { adjustDataType, tableNames } from './ManageColumnsUtils';
import { GSPBackend } from '../../utils/utils';
import AddAttributeModal from './AddColumnModal/AddColumnModal';
import EditColumnModal from './EditColumnModal/EditColumnModal';
import DeleteColumnModal from './DeleteColumnModal/DeleteColumnModal';

import styles from './ManageColumns.module.css';

const { Title } = Typography;

const ManageAttributes = () => {
  const [isAddAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] = useState(false);
  const [isDeleteAttributeModalOpen, setIsDeleteAttributeModalOpen] = useState(false);
  const [attributeNameToEdit, setAttributeNameToEdit] = useState('');
  const [tableState, setTableState] = useState({
    table: 'survey',
    data: [],
  });

  const [isLoading, setIsLoading] = useState(true);

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
    const res = (await GSPBackend.get(`/tables/${tableName.toLowerCase()}/columns`)).data.map(
      id => ({
        ...id,
        attributeName: id.COLUMN_NAME,
        // eslint-disable-next-line no-use-before-define
        dataType: adjustDataType(id.DATA_TYPE),
      }),
    );
    return res;
  };

  // Update table with columns every time a modal is opened/closed or selected table is changed
  useEffect(async () => {
    const cols = await getTableColsFromDB(tableState.table);
    setTableState({ ...tableState, data: cols });
    setIsLoading(false);
  }, [
    tableState.table,
    isAddAttributeModalOpen,
    isDeleteAttributeModalOpen,
    isEditAttributeModalOpen,
  ]);

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
          {record.attributeName !== 'id' && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href="#" onClick={() => editAttributeLabelClicked(record.attributeName)}>
              Edit
            </a>
          )}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          {record.attributeName !== 'id' && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href="#" onClick={() => deleteAttributeButtonClicked(record.attributeName)}>
              Delete
            </a>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AddAttributeModal
        isOpen={isAddAttributeModalOpen}
        setIsOpen={setIsAttributeModalOpen}
        tableName={tableNames[tableState.table]}
        // do i need to also pass in the get all thing for tables.
      />
      <EditColumnModal
        isOpen={isEditAttributeModalOpen}
        setIsOpen={setIsEditAttributeModalOpen}
        tableName={tableNames[tableState.table]}
        columnName={attributeNameToEdit}
      />
      <DeleteColumnModal
        isOpen={isDeleteAttributeModalOpen}
        setIsOpen={setIsDeleteAttributeModalOpen}
        tableName={tableNames[tableState.table]}
        columnName={attributeNameToEdit}
      />
      <div className={styles.window}>
        <div>
          <Title className={styles.title}>Manage Attributes</Title>
          <div>
            <Radio.Group
              defaultValue="Survey"
              buttonStyle="solid"
              onChange={e => setTableState({ ...tableState, table: e.target.value })}
            >
              {Object.values(tableNames).map(name => (
                <Radio.Button key={name} value={name}>
                  {name} Table
                </Radio.Button>
              ))}
            </Radio.Group>
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
          <div className={styles.table}>
            <Table dataSource={tableState.data} columns={columns} bordered />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAttributes;
