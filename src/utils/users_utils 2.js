import { GSPBackend } from './utils';

const getUsersFromDB = async () => {
  const res = await GSPBackend.get('/users');
  const users = res.data;
  console.log(res);
  return users;
};

export default getUsersFromDB;
