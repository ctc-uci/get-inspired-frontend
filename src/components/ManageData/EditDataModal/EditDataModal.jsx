import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, Result, Spin } from 'antd';
import { NotiIcon, NotiMessage, notify } from '../../../utils/utils';

import styles from './EditDataModal.module.css';

const { Title } = Typography;

const EditDataModal = ({ isOpen, setIsOpen, editedRows, selectedTable, saveEdits }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const editButtonClicked = async () => {
    try {
      setIsLoading(true);
      await saveEdits();
      handleOk();
      notify(
        NotiMessage.ROWS_EDITED(Object.keys(editedRows).length, selectedTable),
        NotiIcon.SUCCESS,
      );
      setIsLoading(false);
    } catch (error) {
      notify(
        NotiMessage.ROWS_EDITED_ERROR(Object.keys(editedRows).length, selectedTable, error.message),
        NotiIcon.ERROR,
      );
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <Spin spinning={isLoading} size="large">
        <div className={styles.container}>
          {Object.keys(editedRows).length ? (
            <Result
              title={
                <Title level={2}>
                  Are you sure you want to edit {Object.keys(editedRows).length} row(s)?
                </Title>
              }
              extra={
                <div className={styles.buttons}>
                  <Button type="primary" onClick={editButtonClicked}>
                    Edit {Object.keys(editedRows).length} row(s)
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
              }
            />
          ) : (
            <Result
              status="404"
              title={<Title level={2}>Zero rows edited.</Title>}
              subtitle="Please let your system administrator know how you got here because this should not be possible?"
              extra={<Button onClick={handleCancel}>Return to Editing</Button>}
            />
          )}
        </div>
      </Spin>
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
