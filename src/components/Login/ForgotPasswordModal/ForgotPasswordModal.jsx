import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, Spin, Result, Form, Input, Space, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../utils/auth_utils';
import styles from './ForgotPasswordModal.module.css';
import { humanizeFirebaseError } from '../../../utils/utils';

const { Title } = Typography;

const ForgotPasswordModal = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserReset, setHasUserReset] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleReset = values => {
    const { email } = values;
    setIsLoading(true);
    setUserEmail(email);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setHasUserReset(true);
      })
      .catch(err => {
        setErrorMessage(humanizeFirebaseError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setIsOpen(false);
    setHasUserReset(false);
    setErrorMessage();
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} footer={[]} centered>
      <Spin spinning={isLoading} size="large">
        {hasUserReset ? (
          <Result
            status="success"
            title="Reset Email Sent"
            subTitle={`If you have an account, you should receive an email to ${userEmail} to reset your password shortly.`}
            extra={
              <Button onClick={handleCancel} type="primary">
                Return to Log In
              </Button>
            }
          />
        ) : (
          <div className={styles.container}>
            <Result
              status="warning"
              icon={<LockOutlined />}
              title={<Title level={2}>Forgot your password?</Title>}
              subTitle="Enter your email below to reset your password."
              className={styles['reset-result']}
            />
            {errorMessage && (
              <Alert
                type="error"
                message={errorMessage.title}
                description={errorMessage.desc}
                showIcon
                className={styles['error-message']}
              />
            )}
            <Form onFinish={handleReset} layout="vertical" className={styles['reset-form']}>
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
              <br />
              <Form.Item>
                <div className={styles.buttons}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Reset Password
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Space>
                </div>
              </Form.Item>
            </Form>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
