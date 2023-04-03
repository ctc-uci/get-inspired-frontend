import React, { useState } from 'react';
import { Button, Form, Input, Radio, Typography } from 'antd';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

import GSPLogo from '../../assets/images/GSPLogo.svg';
import styles from './Register.module.css';

const { Title } = Typography;

// eslint-disable-next-line no-unused-vars
const Register = ({ cookies }) => {
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

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
      <div className={styles['logo-container']}>
        <img src={GSPLogo} alt="Get Inspired Logo" />
        <h1>
          Get Inspired: <br /> Pismo Clam Database
        </h1>
      </div>
      <div className={styles.container}>
        <Title>Add User</Title>
        <Form
          id="login-form"
          layout="vertical"
          name="login-form"
          onFinish={handleSubmit}
          className={styles['register-form']}
          initialValues={{ role: 'viewer' }}
        >
          <span>
            <Form.Item
              id="roles"
              label=""
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please choose a role!',
                },
              ]}
            >
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
          Submit
        </Button>
      </div>
    </>
  );
};

Register.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Register);
