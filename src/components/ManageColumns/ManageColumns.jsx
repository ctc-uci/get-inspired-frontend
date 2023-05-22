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
  const [page, setPage] = useState(1);
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
        key: id.COLUMN_NAME,
        attributeName: id.COLUMN_NAME,
        // eslint-disable-next-line no-use-before-define
        dataType: adjustDataType(id.DATA_TYPE),
      }),
    );
    return res;
  };

  const onTableChange = e => {
    setPage(1);
    setTableState({ ...tableState, table: e.target.value });
  };

  useEffect(() => {
    document.title = 'Manage Columns';
  }, []);

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
      title: 'Column Name',
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
          {record.attributeName !== 'id' && record.attributeName !== 'survey_id' && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href="#" onClick={() => editAttributeLabelClicked(record.attributeName)}>
              Edit
            </a>
          )}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          {record.attributeName !== 'id' && record.attributeName !== 'survey_id' && (
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
          <Title className={styles.title}>Manage Columns</Title>
          <div>
            <Radio.Group defaultValue="survey" buttonStyle="solid" onChange={onTableChange}>
              {Object.values(tableNames).map(name => (
                <Radio.Button key={name} value={name.toLowerCase()}>
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
                  + Add Column
                </Button>
              </form>
            </div>
          </div>
          <div className={styles.table}>
            <Table
              dataSource={tableState.data}
              columns={columns}
              bordered
              pagination={{ onChange: setPage, current: page }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAttributes;
