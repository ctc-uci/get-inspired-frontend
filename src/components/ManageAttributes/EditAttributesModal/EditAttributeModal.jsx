import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { withCookies } from '../../../utils/cookie_utils';

import styles from './EditAttributeModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const EditAttributeModal = ({ isOpen, setIsOpen, tableName, columnName }) => {
  const [errorMessage, setErrorMessage] = useState();

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  // this obviously will not work
  const handleSubmit = async values => {
    try {
      const { attributeName } = values;
      await GSPBackend.put(
        `/tables/${`${tableName.toLowerCase()}`}/${columnName}/${attributeName}`,
        {
          tableName,
          columnName,
          attributeName,
        },
      );
      handleOk();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>Edit Attribute</h1>
          <Form
            id="edit-attribute-form"
            layout="vertical"
            name="login-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Attribute Name"
              name="attributeName"
              rules={[
                {
                  required: true,
                  message: 'Please input a name for your attribute!',
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

EditAttributeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
};

export default withCookies(EditAttributeModal);
