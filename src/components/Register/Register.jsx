import React, { useState } from 'react';
import { Button, Form, Input, Radio, Typography } from 'antd';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

import GSPLogo from '../../assets/GSPLogo.svg';
import styles from './Register.module.css';

const { Title } = Typography;

// eslint-disable-next-line no-unused-vars
const Register = ({ cookies }) => {
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

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
      <div className={styles['logo-container']}>
        <img src={GSPLogo} alt="Get Inspired Logo" />
        <h1>
          Get Inspired: <br /> Pismo Clam Database
        </h1>
      </div>
      <div className={styles.container}>
        <Title>Sign Up</Title>
        <Form
          id="login-form"
          layout="vertical"
          name="login-form"
          onFinish={handleSubmit}
          className={styles['register-form']}
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
