import { React } from 'react';
import { Table, Space } from 'antd';
import ManageUsers from '../../components/ManageUsers/ManageUsers';

const { Column } = Table;

const data = [
  {
    name: 'John',
    email: 'john@uci.edu',
    password: 'testing',
    role: 'dev',
    key: '1',
  },
  {
    name: 'Ted',
    email: 'ted@uci.edu',
    password: 'blahblah',
    role: 'dev',
    key: '2',
  },
  {
    name: 'Matt',
    email: 'matt@gmail.com',
    password: 'password',
    role: 'dev',
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
  return (
    <div>
      <div id="wrapper">
        <div id="div1">
          <h1>Manage Users</h1>
        </div>
        <div id="div2">
          <ManageUsers />
        </div>
      </div>
      <Table dataSource={data}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Password" dataIndex="password" key="password" />
        <Column title="Role" dataIndex="role" key="role" />
        <Column
          title="Account History"
          dataIndex="history"
          key="history"
          render={() => (
            <Space size="middle">
              <a href="https://www.youtube.com/watch?v=pSUydWEqKwE">View</a>
            </Space>
          )}
        />
        <Column
          title="Setting"
          key="setting"
          render={() => (
            <Space size="middle">
              <a href="https://www.youtube.com/watch?v=pSUydWEqKwE">Edit</a>
              <a href="https://www.youtube.com/watch?v=pSUydWEqKwE">Delete</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default ManageUsersPage;
