import React, { useState, useEffect } from 'react';
import { Radio, Space, Table, Button, Typography } from 'antd';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { adjustDataType, tableNames } from './ManageColumnsUtils';
import { GSPBackend } from '../../utils/utils';
import { useAuthContext } from '../../common/AuthContext';
import AddAttributeModal from './AddColumnModal/AddColumnModal';
import EditColumnModal from './EditColumnModal/EditColumnModal';
import DeleteColumnModal from './DeleteColumnModal/DeleteColumnModal';

import styles from './ManageColumns.module.css';

const { Title } = Typography;

const ManageAttributes = () => {
  const restrictedCols = {
    survey: ['id', 'Duration', 'Distance'],
    clam: ['id', 'survey_id', 'Length', 'Width', 'Weight'],
    raker: ['id', 'survey_id', 'Start Time', 'End Time', 'Rake Distance', 'Rake Width'],
  };
  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isAddAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] = useState(false);
  const [isDeleteAttributeModalOpen, setIsDeleteAttributeModalOpen] = useState(false);
  const [attributeNameToEdit, setAttributeNameToEdit] = useState('');
  const [tableState, setTableState] = useState({
    table: 'survey',
    data: [],
    cols: [],
    page: 1,
  });

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

  const getColumns = tableName => {
    let newColumns = [
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
    ];

    if (tableName !== 'computation') {
      newColumns = [
        ...newColumns,
        {
          title: 'Actions',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              {!restrictedCols[tableName].includes(record.attributeName) && (
                <>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={() => editAttributeLabelClicked(record.attributeName)}>
                    Edit
                  </a>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={() => deleteAttributeButtonClicked(record.attributeName)}>
                    Delete
                  </a>
                </>
              )}
            </Space>
          ),
        },
      ];
    }

    return newColumns;
  };

  const onTableChange = e => {
    setIsTableLoading(true);
    setTableState({ ...tableState, table: e.target.value, page: 1 });
  };

  const onPageChange = pageNum => {
    setIsTableLoading(true);
    setTableState({ ...tableState, page: pageNum });
    setIsTableLoading(false);
  };

  useEffect(() => {
    document.title = 'Manage Columns';
  }, []);

  // Update table with columns every time a modal is opened/closed or selected table is changed
  useEffect(async () => {
    if (!isTableLoading) setIsTableLoading(true);
    const cols = await getTableColsFromDB(tableState.table);
    const newCols = getColumns(tableState.table);
    setTableState({ ...tableState, columns: newCols, data: cols });

    setIsLoading(false);
    setIsTableLoading(false);
  }, [
    tableState.table,
    isAddAttributeModalOpen,
    isDeleteAttributeModalOpen,
    isEditAttributeModalOpen,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentUser?.role === 'admin') {
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
                    disabled={tableState.table === 'computation'} // Disable the button if the table is "computation"
                  >
                    + Add Column
                  </Button>
                </form>
              </div>
            </div>
            <div className={styles.table}>
              <Table
                dataSource={tableState.data}
                columns={tableState.columns}
                loading={isTableLoading}
                bordered
                pagination={{ onChange: onPageChange, current: tableState.page }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Intern View
  return (
    <>
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
          </div>
          <div className={styles.table}>
            <Table
              dataSource={tableState.data}
              columns={tableState.columns.filter(column => column.title !== 'Actions')}
              bordered
              loading={isTableLoading}
              pagination={{
                onChange: onPageChange,
                current: tableState.page,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAttributes;
