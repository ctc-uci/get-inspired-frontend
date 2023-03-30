import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography } from 'antd';

import { NotiIcon, NotiMessage, notify } from '../../../utils/utils';

import styles from './EditDataModal.module.css';

const { Title } = Typography;

const EditDataModal = ({ isOpen, setIsOpen, editedRows, selectedTable, saveEdits }) => {
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const editButtonClicked = async () => {
    try {
      await saveEdits();
      handleOk();
      notify(
        NotiMessage.ROWS_EDITED(Object.keys(editedRows).length, selectedTable),
        NotiIcon.SUCCESS,
      );
    } catch (error) {
      notify(
        NotiMessage.ROWS_EDITED_ERROR(Object.keys(editedRows).length, selectedTable, error.message),
        NotiIcon.ERROR,
      );
    }
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        {Object.keys(editedRows).length ? (
          <>
            <Title level={3}>
              Are you sure you want to edit {Object.keys(editedRows).length} row(s)?
            </Title>
            <div className={styles.buttons}>
              <Button type="primary" onClick={editButtonClicked}>
                Edit {Object.keys(editedRows).length} row(s)
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <Title level={3}>Zero rows edited.</Title>
            <Button onClick={handleCancel}>Got it</Button>
          </>
        )}
      </div>
    </Modal>
  );
};

EditDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  editedRows: PropTypes.shape({}).isRequired,
  selectedTable: PropTypes.string.isRequired,
  saveEdits: PropTypes.func.isRequired,
};

export default EditDataModal;
