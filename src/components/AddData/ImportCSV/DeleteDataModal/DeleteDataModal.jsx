import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography } from 'antd';

import styles from './DeleteDataModal.module.css';

const { Title } = Typography;
const DeleteDataModal = ({ isOpen, setIsOpen, selectedRowKeys, deleteSelectedRows }) => {
  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleDeleteSelected = () => {
    deleteSelectedRows();
    handleOk();
  };
  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <Title level={4}>
          Are you sure you want to remove {selectedRowKeys.length} row(s) from uploading?
        </Title>
        <div className={styles.buttons}>
          <Button type="primary" onClick={handleDeleteSelected}>
            Yes, remove {selectedRowKeys.length} row(s)
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
  selectedRowKeys: PropTypes.arrayOf(PropTypes.number).isRequired,
  deleteSelectedRows: PropTypes.func.isRequired,
};

export default DeleteDataModal;
