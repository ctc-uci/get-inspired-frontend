import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography } from 'antd';

import styles from './CancelModal.module.css';

const { Title } = Typography;

const CancelModal = ({ isOpen, setIsOpen, editedRows, setEditingMode }) => {
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const cancelButtonClicked = () => {
    setEditingMode(false);
    handleOk();
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <Title level={3}>
          You have unsaved changes. Are you sure you want to discard changes for{' '}
          {Object.keys(editedRows).length} row(s)?
        </Title>
        <div className={styles.buttons}>
          <Button className={styles['cancel-button']} onClick={cancelButtonClicked}>
            Yes, discard changes for {Object.keys(editedRows).length} row(s)
          </Button>
          <Button onClick={handleCancel} type="primary">
            Return to editing
          </Button>
        </div>
      </div>
    </Modal>
  );
};

CancelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  editedRows: PropTypes.shape({}).isRequired,
  setEditingMode: PropTypes.func.isRequired,
};

export default CancelModal;
