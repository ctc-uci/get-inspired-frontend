import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { withCookies } from '../../../utils/cookie_utils';
import { NotiMessage, NotiIcon, notify } from '../../../utils/utils';
import { registerWithEmailAndPassword } from '../../../utils/auth_utils';

import styles from './AddUserModal.module.css';

const AddUserModal = ({ isOpen, setIsOpen, fetchUsersFromDB }) => {
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSubmit = async values => {
    try {
      const { role, firstName, lastName, email, password, checkPassword } = values;
      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }

      await registerWithEmailAndPassword(
        email,
        password,
        role,
        firstName,
        lastName,
        navigate,
        '/manage-users',
      );
      await fetchUsersFromDB();
      notify(NotiMessage.USER_ADDED, NotiIcon.SUCCESS);
      handleOk();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal
      centered
      open={isOpen}
      okText="Submit"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      <div className={styles.container}>
        <h1>Add User</h1>
        <Form
          id="login-form"
          layout="vertical"
          name="login-form"
          onFinish={handleSubmit}
          initialValues={{ role: 'intern' }}
        >
          <span>
            <Form.Item label="" name="role">
              <Radio.Group>
                <Radio value="intern">Intern</Radio>
                <Radio value="admin">Admin</Radio>
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
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Set Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password type="text" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="checkPassword"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password type="text" />
          </Form.Item>
        </Form>
        <p>{errorMessage}</p>
        <Button type="primary" form="login-form" key="submit" htmlType="submit">
          Add User
        </Button>
      </div>
    </Modal>
  );
};

AddUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchUsersFromDB: PropTypes.func.isRequired,
};

export default withCookies(AddUserModal);
