import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../../utils/auth_utils';

import GSPLogo from '../../assets/GSPLogo.svg';

import styles from './Login.module.css';

const { Title } = Typography;
const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Object} values
   */
  const handleSubmit = async values => {
    try {
      const { email, password } = values;
      await logInWithEmailAndPassword(email, password, '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
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
        <Title>Login</Title>
        {errorMessage && <p>{errorMessage}</p>}
        <Form onFinish={handleSubmit} layout="vertical" className={styles['login-form']}>
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
            <Input.Password type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);
