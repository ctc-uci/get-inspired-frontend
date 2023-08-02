import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, Spin, Space } from 'antd';
import { PropTypes, instanceOf } from 'prop-types';
import { Navigate } from 'react-router-dom';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { GSPBackend, humanizeFirebaseError } from '../../utils/utils';
import { withCookies, cookieKeys, Cookies, clearCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate, refreshToken } from '../../utils/auth_utils';

import GSPLogo from '../../assets/images/GSPLogo.svg';
import styles from './Login.module.css';
import ForgotPasswordModal from './ForgotPasswordModal/ForgotPasswordModal';

const { Title } = Typography;

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

const Login = ({ roles, cookies }) => {
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    document.title = 'Log In - Get Inspired: Pismo Clam Database';
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
      setIsWaiting(true);
      const { email, password } = values;
      await logInWithEmailAndPassword(email, password, '/', navigate, cookies);
    } catch (err) {
      setErrorMessage(humanizeFirebaseError(err));
    } finally {
      setIsWaiting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const onResetButtonClick = () => {
    setIsResetModalOpen(true);
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
        <Spin spinning={isWaiting} size="large" className={styles.container}>
          <Space align="center" direction="vertical">
            <Title>Login</Title>
            {errorMessage && (
              <Alert
                type="error"
                message={errorMessage.title}
                description={errorMessage.desc}
                showIcon
                className={styles['error-message']}
              />
            )}
            <Form
              size="middle"
              onFinish={handleSubmit}
              layout="vertical"
              className={styles['login-form']}
            >
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
                <Space direction="vertical" align="center" className={styles['login-buttons']}>
                  <Button type="primary" htmlType="submit" size="large">
                    Log In
                  </Button>
                  <Button type="link" onClick={onResetButtonClick} size="small">
                    Forgot your password?
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            <ForgotPasswordModal isOpen={isResetModalOpen} setIsOpen={setIsResetModalOpen} />
          </Space>
        </Spin>
      </div>
    </>
  );
};

Login.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);
