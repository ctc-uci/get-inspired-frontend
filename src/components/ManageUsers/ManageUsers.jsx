import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

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
    // e.preventDefault();

    try {
      const { role, firstName, lastName, email, password, checkPassword } = values;
      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }
      // console.log(
      //   role,
      //   email,
      //   password,
      //   checkPassword,
      //   firstName,
      //   lastName);

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

  // /**
  //  * This function handles signing up with Google
  //  * If the user logs in and is new, they are directed to a new-user path
  //  * If the user logs in and isn't new, they are directed to the dashboard.
  //  * If the user fails to log in, they are directed back to the login screen
  //  */
  // const handleGoogleSignIn = async e => {
  //   try {
  //     e.preventDefault();
  //     await signInWithGoogle('/new-user', '/logout', navigate, cookies);
  //   } catch (err) {
  //     setErrorMessage(err.message);
  //   }
  // };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
      <Modal
        title="Add User"
        open={isModalOpen}
        okText="Submit"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" form="login-form" key="submit" htmlType="submit">
            Submit
          </Button>,
        ]}
      >
        <Form id="login-form" layout="vertical" name="login-form" onFinish={handleSubmit}>
          <Form.Item label="" name="role">
            <Radio.Group>
              <Radio value="viewer">Viewer</Radio>
              <Radio value="editor">Editor</Radio>
            </Radio.Group>
          </Form.Item>

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
          <Form.Item
            label="Check Password"
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
      </Modal>
    </>
  );
};

ManageUsers.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ManageUsers);
