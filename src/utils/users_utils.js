import { GSPBackend } from './utils';

const getUsersFromDB = async () => {
  const res = await GSPBackend.get('/users');
  const users = res.data.map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  }));
  return users;
};

export default getUsersFromDB;
