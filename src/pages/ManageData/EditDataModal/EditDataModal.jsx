import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography } from 'antd';

import styles from './EditDataModal.module.css';

const { Title } = Typography;

const EditDataModal = ({ isOpen, setIsOpen, editedRows, saveEdits }) => {
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const editButtonClicked = async () => {
    await saveEdits();
    handleOk();
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        {editedRows ? (
          <>
            <Title level={3}>
              Are you sure you want to edit {Object.keys(editedRows).length} row(s)?
            </Title>
            <div className={styles.buttons}>
              <Button
                className={styles['delete-button']}
                type="primary"
                onClick={editButtonClicked}
              >
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
  saveEdits: PropTypes.func.isRequired,
};

export default EditDataModal;
