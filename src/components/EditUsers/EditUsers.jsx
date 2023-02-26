import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

import styles from './EditUsers.module.css';

// eslint-disable-next-line no-unused-vars
const EditUsers = ({ cookies }) => {
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
      const { role, name, email, password } = values;

      await registerWithEmailAndPassword(email, password, role, name, navigate, '/login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={showModal} style={{ color: '#3689fc', textDecoration: 'none' }}>
        Edit
      </a>
      <Modal open={isModalOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>Edit User</h1>
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
              label="Name"
              name="name"
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
              label="Password"
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
          </Form>
          <p>{errorMessage}</p>
          <Button type="primary" form="login-form" key="submit" htmlType="submit">
            Save Edits
          </Button>
        </div>
      </Modal>
    </>
  );
};

EditUsers.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(EditUsers);
