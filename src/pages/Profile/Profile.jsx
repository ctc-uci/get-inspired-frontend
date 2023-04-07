import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Card, Typography, Input, Form, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../common/AuthContext';

import DiscardAccountInfoModal from './DiscardAccountInfoModal/DiscardAccountInfoModal';
import EditAccountInfoModal from './EditAccountInfoModal/EditAccountInfoModal';
import LogoutModal from './LogoutModal/LogoutModal';

import { GSPBackend } from '../../utils/utils';

import styles from './Profile.module.css';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDiscardAccountInfoModalOpen, setIsDiscardAccountInfoModalOpen] = useState(false);
  const [isEditAccountInfoModalOpen, setIsEditAccountInfoModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const { currentUser, setCurrentUser } = useAuthContext();
  const [fullName, setFullName] = useState('');

  // Formats a user's role for the badge on the avatar
  const formatRole = role => role.charAt(0).toUpperCase() + role.slice(1);

  // Formats a user's full name
  const getFullName = user => {
    return `${user.firstName} ${user.lastName}`;
  };

  // Extra button at the top of the Account Information card
  // eslint-disable-next-line react/prop-types
  const ExtraButton = ({ disabled }) => {
    if (editingMode) {
      return (
        <Button
          className={styles['edit-button']}
          onClick={() => setIsDiscardAccountInfoModalOpen(true)}
        >
          Discard changes
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        className={styles['edit-button']}
        onClick={() => setEditingMode(true)}
        disabled={disabled}
      >
        Edit
      </Button>
    );
  };

  // When editing mode is toggled, update the form with the current user's information
  useEffect(async () => {
    const updatedUser = (await GSPBackend.get(`/users/${currentUser.id}`)).data[0];
    form.setFieldsValue(updatedUser);
    setCurrentUser(setCurrentUser);
    setFullName(getFullName(updatedUser));
  }, [editingMode]);

  return (
    <div className={styles.container}>
      <LogoutModal isOpen={isLogoutModalOpen} setIsOpen={setIsLogoutModalOpen} />
      <Card
        title="Profile"
        extra={
          <Button className={styles['logout-button']} onClick={() => setIsLogoutModalOpen(true)}>
            Logout
          </Button>
        }
      >
        <div className={styles.profile}>
          <Badge.Ribbon text={formatRole(currentUser.role)} placement="start">
            <Avatar className={styles.avatar} size={150} shape="square" icon={<UserOutlined />} />
          </Badge.Ribbon>
          <div className={styles.name}>
            <Title className={styles.title} level={5}>
              Name
            </Title>
            <Text>{fullName}</Text>
          </div>
        </div>
      </Card>

      <Card
        title="Account Information"
        extra={<ExtraButton disabled={currentUser.role !== 'admin'} />}
      >
        <Form
          defaultValue={currentUser}
          className={styles.form}
          form={form}
          layout="vertical"
          onFinish={() => setIsEditAccountInfoModalOpen(true)}
        >
          <DiscardAccountInfoModal
            isOpen={isDiscardAccountInfoModalOpen}
            setIsOpen={setIsDiscardAccountInfoModalOpen}
            setEditingMode={setEditingMode}
          />
          <EditAccountInfoModal
            isOpen={isEditAccountInfoModalOpen}
            setIsOpen={setIsEditAccountInfoModalOpen}
            setEditingMode={setEditingMode}
          />
          <Form.Item name="firstName" label="First Name">
            <Input disabled={!editingMode} />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name">
            <Input disabled={!editingMode} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled={!editingMode} />
          </Form.Item>
          {editingMode && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
