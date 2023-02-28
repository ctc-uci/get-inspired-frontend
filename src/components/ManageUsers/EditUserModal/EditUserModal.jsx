import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { withCookies } from '../../../utils/cookie_utils';

import styles from './EditUserModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const EditUsersModal = ({ isOpen, setIsOpen, id, fetchUsersFromDB }) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState();

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(async () => {
    if (id) {
      const user = await GSPBackend.get(`/users/${id}`);
      form.setFieldsValue({
        role: user.data[0].role,
        firstName: user.data[0].firstName,
        lastName: user.data[0].lastName,
      });
    }
  }, [id]);

  const handleSubmit = async values => {
    try {
      const { role, firstName, lastName } = values;

      await GSPBackend.put(`/users/${id}`, {
        role,
        firstName,
        lastName,
      });
      await fetchUsersFromDB();
      handleOk();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Modal open={isOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>Edit User</h1>
          <Form
            id="edit-user-form"
            layout="vertical"
            name="login-form"
            form={form}
            onFinish={handleSubmit}
          >
            <span>
              <Form.Item label="" name="role">
                <Radio.Group>
                  <Radio value="viewer">Viewer</Radio>
                  <Radio value="editor">Editor</Radio>
                </Radio.Group>
              </Form.Item>
            </span>

            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Please input your last name!',
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>
          </Form>
          <p>{errorMessage}</p>
          <Button type="primary" form="edit-user-form" key="submit" htmlType="submit">
            Save Edits
          </Button>
        </div>
      </Modal>
    </>
  );
};

EditUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchUsersFromDB: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default withCookies(EditUsersModal);
