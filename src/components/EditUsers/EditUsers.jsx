import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { instanceOf, PropTypes } from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';

import styles from './EditUsers.module.css';
import { GSPBackend } from '../../utils/utils';

// eslint-disable-next-line no-unused-vars
const EditUsers = ({ cookies, record }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const navigate = useNavigate();

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
      const { role, firstName, lastName } = values;

      GSPBackend.put(`/users/${record.id}`, {
        role,
        firstName,
        lastName,
      });
      handleOk();
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
  record: PropTypes.string.isRequired,
};

export default withCookies(EditUsers);
