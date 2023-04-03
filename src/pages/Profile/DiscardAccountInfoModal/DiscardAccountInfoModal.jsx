import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Typography, Button, Form } from 'antd';

import styles from './DiscardAccountInfoModal.module.css';

const { Title } = Typography;

const DiscardAccountInfoModal = ({ isOpen, setIsOpen, setEditingMode }) => {
  const form = Form.useFormInstance();
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const discardChanges = () => {
    form.resetFields();
    setEditingMode(false);
    handleOk();
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk} footer={[]}>
      <div className={styles.container}>
        <Title level={3}>Are you sure you want to discard all of your changes?</Title>
        <div className={styles.buttons}>
          <Button onClick={discardChanges}>Yes</Button>
          <Button type="primary" onClick={handleCancel}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

DiscardAccountInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setEditingMode: PropTypes.func.isRequired,
};

export default DiscardAccountInfoModal;
