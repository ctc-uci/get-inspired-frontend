import React from 'react';
import { Button, Modal, Typography } from 'antd';
import PropTypes from 'prop-types';
import { withCookies } from '../../../utils/cookie_utils';
import { GSPBackend, notify, NotiMessage, NotiIcon } from '../../../utils/utils';

import styles from './DeleteColumnModal.module.css';

const { Title } = Typography;

const DeleteColumnModal = ({ isOpen, setIsOpen, tableName, columnName }) => {
  const handleOk = () => {
    setIsOpen(false);
    notify(NotiMessage.COLUMN_DELETED(columnName, tableName), NotiIcon.SUCCESS);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  // this obviously will not work
  const handleSubmit = async () => {
    try {
      await GSPBackend.delete(`/tables/${`${tableName.toLowerCase()}`}/${columnName}`, {
        columnName,
      });
      handleOk();
    } catch (error) {
      notify(NotiMessage.COLUMN_DELETE_ERROR(columnName, tableName), NotiIcon.ERROR, error.message);
    }
  };

  return (
    <>
      <Modal open={isOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <Title level={5} className={styles.confirmation}>
            Are you sure you want to delete the column &apos;{columnName}&apos; from the &apos;
            {tableName.toLowerCase()}&apos; table (This action cannot be undone)?
          </Title>
          <Button
            type="primary"
            form="edit-user-form"
            key="submit"
            htmlType="submit"
            onClick={handleSubmit}
          >
            Delete Column
          </Button>
        </div>
      </Modal>
    </>
  );
};

DeleteColumnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
};

export default withCookies(DeleteColumnModal);
