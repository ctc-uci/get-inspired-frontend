import React, { useState, useEffect } from 'react';
import { Radio, Button, Cascader } from 'antd';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import { GSPBackend } from '../../utils/utils';
import styles from './ManageData.module.css';

const ManageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({});
  useEffect(async () => {
    const map = await GSPBackend.get('/surveys/manageDataMap');
    setOptions(map.data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
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
      <div className={styles['select-survey-options']}>
        <Cascader
          className={styles['.cascades']}
          options={options}
          placeholder="Please select a year"
        />
        <Button type="primary">Load Survey Data</Button>
      </div>
    </div>
  );
};

export default ManageData;
