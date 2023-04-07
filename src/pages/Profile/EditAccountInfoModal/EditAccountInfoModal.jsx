import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Typography, Button, Form } from 'antd';
import { GSPBackend, NotiMessage, NotiIcon, notify } from '../../../utils/utils';

import styles from './EditAccountInfoModal.module.css';

const { Title } = Typography;

const EditAccountInfoModal = ({ isOpen, setIsOpen, setEditingMode }) => {
  const form = Form.useFormInstance();
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  // Saves edits in account information
  const saveAccountInformation = async () => {
    try {
      const id = form.getFieldValue('id');
      await GSPBackend.put(`/users/${id}`, form.getFieldsValue());
      notify(NotiMessage.ACCOUNT_INFORMATION_EDITED, NotiIcon.SUCCESS);
      setEditingMode(false);
      handleOk();
    } catch (error) {
      notify(NotiMessage.ACCOUNT_INFORMATION_EDITED_ERROR(error), NotiIcon.ERROR);
    }
  };
  return (
    <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk} footer={[]}>
      <div className={styles.container}>
        <Title level={3}>Are you sure you want to edit your account information?</Title>
        <div className={styles.buttons}>
          <Button type="primary" onClick={saveAccountInformation}>
            Yes
          </Button>
          <Button onClick={handleCancel}>No</Button>
        </div>
      </div>
    </Modal>
  );
};

EditAccountInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setEditingMode: PropTypes.func.isRequired,
};

export default EditAccountInfoModal;
