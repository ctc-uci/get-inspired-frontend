import React from 'react';
import { Collapse, Button } from 'antd';
import styles from './Dashboard.module.css';
// import axios from 'axios';

const Dashboard = () => {
  return (
    <div>
      <h1>dashboard</h1>
      <div className="dashboard-panels">
        <p className={styles.buttons}>Sort by: </p>
        <Button className={styles.buttons}>Beach</Button>
        <Button>Date</Button>
        <Button>Location</Button>
        <Collapse className={styles.allsections}>
          <Collapse.Panel header="Huntington Beach" key="1">
            <p>Zone 1</p>
          </Collapse.Panel>
          <Collapse.Panel header="Newport Beach" key="2">
            <p>Zone 1</p>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default Dashboard;
