import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, Result, Spin } from 'antd';

import { NotiMessage, NotiIcon, notify } from '../../../utils/utils';

import styles from './DeleteDataModal.module.css';

const { Title } = Typography;

const DeleteDataModal = ({
  isOpen,
  setIsOpen,
  selectedTable,
  selectedRowKeys,
  deleteSelectedRows,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const deleteButtonClicked = async () => {
    setIsLoading(true);
    try {
      await deleteSelectedRows();
      handleOk();
      notify(NotiMessage.ROWS_DELETED(selectedRowKeys.length, selectedTable), NotiIcon.SUCCESS);
    } catch (error) {
      notify(
        NotiMessage.ROWS_DELETED_ERROR(selectedRowKeys.length, selectedTable, error.message),
        NotiIcon.ERROR,
      );
    }
    setIsLoading(false);
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <Spin spinning={isLoading} size="large">
        <Result
          status="warning"
          title={
            <Title level={2}>
              Are you sure you want to delete {selectedRowKeys.length} row(s)?
            </Title>
          }
          subTitle={
            <>
              {selectedTable === 'survey' && (
                <Title level={4} type="danger">
                  Deleting a survey will also delete all associated clams and rakers
                </Title>
              )}
              <Title level={4} type="danger">
                This action is irreversible!
              </Title>
            </>
          }
          extra={
            <div className={styles.container}>
              <div className={styles.buttons}>
                <Button danger type="primary" onClick={deleteButtonClicked}>
                  Delete {selectedRowKeys.length} row(s)
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          }
        />
      </Spin>
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
