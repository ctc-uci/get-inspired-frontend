import React from 'react';
import { Radio, Button, Cascader } from 'antd';
import styles from './ManageData.module.css';

const options = [
  {
    value: '2023',
    label: '2023',
    children: [
      {
        value: 'a',
        label: '1/11/2023 - Huntington - Zone1',
      },
    ],
  },
  {
    value: '2022',
    label: '2022',
    children: [
      {
        value: 'b',
        label: '2/24/2022 - Huntington - Zone1',
      },
    ],
  },
];

const ManageData = () => {
  return (
    <div className={styles['manage-data-container']}>
      <h1>Manage Data</h1>
      <Radio.Group defaultValue="computation" buttonStyle="solid">
        <Radio.Button value="computation">Computations Table</Radio.Button>
        <Radio.Button value="survey">Survey Table</Radio.Button>
        <Radio.Button value="clam">Clam Table</Radio.Button>
        <Radio.Button value="raker">Raker Table</Radio.Button>
      </Radio.Group>
      <br />
      <Cascader className={styles['.cascades']} options={options} placeholder="Please select" />
      <Button type="primary">Load Survey Data</Button>
    </div>
  );
};

export default ManageData;
