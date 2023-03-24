import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Typography } from 'antd';
import PropTypes from 'prop-types';
import { withCookies } from '../../../utils/cookie_utils';
import { GSPBackend, notify, NotiIcon, NotiMessage } from '../../../utils/utils';

import styles from './EditColumnModal.module.css';

const { Title } = Typography;

const EditColumnModal = ({ isOpen, setIsOpen, tableName, columnName }) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState();

  const handleOk = () => {
    setIsOpen(false);
    notify(
      NotiMessage.COLUMN_EDITED(columnName, form.getFieldValue('attributeName'), tableName),
      NotiIcon.SUCCESS,
    );
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      form.setFieldValue('attributeName', '');
    }
  }, [isOpen]);

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
      // Temporary error handling so eslint doesn't complain
      console.log(errorMessage);
    }
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <Title level={3} className={styles.header}>
          Edit Column
        </Title>
        <Form
          id="edit-attribute-form"
          layout="vertical"
          name="login-form"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item label="Current Column Name">
            <Input type="text" value={columnName} disabled />
          </Form.Item>
          <Form.Item
            label="New Column Name"
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
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

EditColumnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
};

export default withCookies(EditColumnModal);
