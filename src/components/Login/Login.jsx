import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { PropTypes, instanceOf } from 'prop-types';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from '../../utils/utils';
import { withCookies, cookieKeys, Cookies, clearCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate, refreshToken } from '../../utils/auth_utils';

import GSPLogo from '../../assets/images/GSPLogo.svg';

import styles from './Login.module.css';

const userIsAuthenticated = async (roles, cookies) => {
  try {
    const accessToken = await refreshToken(cookies);
    if (!accessToken) {
      return false;
    }
    const loggedIn = await GSPBackend.get(`/auth/verifyToken/${accessToken}`);

    return roles.includes(cookies.get(cookieKeys.ROLE)) && loggedIn.status === 200;
  } catch (err) {
    clearCookies(cookies);
    return false;
  }
};

const { Title } = Typography;
const Login = ({ roles, cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    const authenticated = await userIsAuthenticated(roles, cookies);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Object} values
   */
  const handleSubmit = async values => {
    try {
      const { email, password } = values;
      await logInWithEmailAndPassword(email, password, '/', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

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
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);
