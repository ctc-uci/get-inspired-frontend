import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

import styles from './ManageUsers.module.css';

// eslint-disable-next-line no-unused-vars
const ManageUsers = ({ cookies }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
        '/login',
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
      <Modal open={isModalOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>Add User</h1>
          <Form
            id="login-form"
            layout="vertical"
            name="login-form"
            onFinish={handleSubmit}
            initialValues={{ role: 'viewer' }}
          >
            <span>
              <Form.Item label="" name="role">
                <Radio.Group defaultValue="viewer">
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
            Sign Up
          </Button>
        </div>
      </Modal>
    </>
  );
};

ManageUsers.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageUsers);