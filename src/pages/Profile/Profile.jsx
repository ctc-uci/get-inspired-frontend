import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { getCurrentUser, auth } from '../../utils/auth_utils';
import { GSPBackend } from '../../utils/utils';

const { Title } = Typography;

const auth1 = auth;

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth1) {
        const user = await getCurrentUser(auth1);
        if (user) {
          const response = await GSPBackend.get(`/users/${user.uid}`);
          setCurrentUser(response.data);
        }
      }
    };
    fetchUser();
  }, [auth]);

  return (
    <div>
      <Title level={2}>Profile Page</Title>
      <p>First Name: {currentUser[0].firstName}</p>
      <p>Last Name: {currentUser[0].lastName}</p>
      <p>Email: {currentUser[0].email}</p>
      <p>Role: {currentUser[0].role}</p>
    </div>
  );
};

export default Profile;
