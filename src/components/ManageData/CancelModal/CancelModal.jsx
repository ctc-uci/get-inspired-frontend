import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, Result, Spin } from 'antd';

import styles from './CancelModal.module.css';

const { Title } = Typography;

const CancelModal = ({ isOpen, setIsOpen, editedRows, setEditingMode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const cancelButtonClicked = () => {
    setIsLoading(true);
    handleOk();
    setEditingMode(false);
    setIsLoading(false);
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <Spin spinning={isLoading} size="large">
        <Result
          status="warning"
          title={<Title level={2}>You have unsaved changes</Title>}
          subTitle={
            <Title level={4}>
              Are you sure you want to discard changes for {Object.keys(editedRows).length} row(s)?
            </Title>
          }
          extra={
            <div className={styles.container}>
              <div className={styles.buttons}>
                <Button className={styles['cancel-button']} onClick={cancelButtonClicked}>
                  Yes, discard changes for {Object.keys(editedRows).length} row(s)
                </Button>
                <Button onClick={handleCancel} type="primary">
                  Return to editing
                </Button>
              </div>
            </div>
          }
        />
      </Spin>
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
