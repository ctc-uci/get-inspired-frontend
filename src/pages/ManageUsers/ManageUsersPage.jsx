import { React } from 'react';
import { Table, Space } from 'antd';
import ManageUsers from '../../components/ManageUsers/ManageUsers';
import EditUsers from '../../components/EditUsers/EditUsers';
// import getUsersFromDB from '../../utils/users_utils';

import styles from './ManageUsersPage.module.css';

const { Column } = Table;

const data = [
  {
    name: 'Megatron',
    role: 'dev',
    email: 'megatron@uci.edu',
    key: '1',
  },
  {
    name: 'Danny Phantom',
    role: 'dev',
    email: 'danny@uci.edu',
    key: '2',
  },
  {
    name: 'Thanos',
    role: 'dev',
    email: 'thanos@uci.edu',
    key: '3',
  },
];

/*
will fix this later (add notification to the import antd)
const [api, contextHolder] = notification.useNotification();
const openNotification = (placement) => { // call this function after form submitted
  api.info({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};
*/

const ManageUsersPage = () => {
  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   const fetchUsersFromDB = async () => {
  //     const usersFromDB = await getUsersFromDB();
  //     setUsers(usersFromDB);
  //   };
  //   fetchUsersFromDB();
  // }, []);

  return (
    <>
      <ManageUsers />
      <div className={styles.container}>
        <div className={styles.page}>
          <Table size="middle" width="10%" dataSource={data}>
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Role" dataIndex="role" key="role" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column
              title="Setting"
              key="setting"
              render={() => (
                <Space size="middle">
                  <EditUsers />
                  <a href="https://www.youtube.com/watch?v=pSUydWEqKwE">Delete</a>
                </Space>
              )}
            />
          </Table>
        </div>
      </div>
    </>
  );
};

export default ManageUsersPage;
