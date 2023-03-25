import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

import styles from './DeleteDataModal.module.css';

const { Title } = Typography;

const DeleteDataModal = ({
  isOpen,
  setIsOpen,
  selectedTable,
  selectedRowKeys,
  deleteSelectedRows,
}) => {
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const deleteButtonClicked = async () => {
    await deleteSelectedRows();
    handleOk();
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <Title level={3}>Are you sure you want to delete {selectedRowKeys.length} row(s)?</Title>
        {selectedTable === 'survey' && (
          <Title level={5} className={styles.warning}>
            Deleting a survey will also delete all associated clams and rakers!
          </Title>
        )}
        <Title level={5} className={styles.warning}>
          <WarningOutlined />
          This action is irreversible!
        </Title>
        <div className={styles.buttons}>
          <Button className={styles['delete-button']} type="primary" onClick={deleteButtonClicked}>
            Delete {selectedRowKeys.length} row(s)
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

DeleteDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  selectedTable: PropTypes.string.isRequired,
  selectedRowKeys: PropTypes.arrayOf(PropTypes.number).isRequired,
  deleteSelectedRows: PropTypes.func.isRequired,
};

export default DeleteDataModal;
