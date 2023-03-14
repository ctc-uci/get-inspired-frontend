import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { withCookies } from '../../../utils/cookie_utils';

import styles from './DeleteAttributesModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const DeleteAttributesModal = ({ isOpen, setIsOpen, tableName, columnName }) => {
  const handleOk = () => {
    setIsOpen(false);
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
      // do i need to get table after with updated info
      handleOk();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Modal open={isOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>{tableName}</h1>
          <Button
            type="primary"
            form="edit-user-form"
            key="submit"
            htmlType="submit"
            onClick={handleSubmit}
          >
            Delete Attribute
          </Button>
        </div>
      </Modal>
    </>
  );
};

DeleteAttributesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
};

export default withCookies(DeleteAttributesModal);
