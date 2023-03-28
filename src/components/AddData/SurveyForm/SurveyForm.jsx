import React, { useState, useEffect } from 'react';
import { Form, Typography, Cascader } from 'antd';
import PropTypes from 'prop-types';
import { UserInput } from './SurveyFormUtils';
import LoadingScreen from '../../../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from '../../../utils/utils';

import styles from './SurveyForm.module.css';

const { Title } = Typography;

const SurveyForm = ({ incrStep, setSurveyData }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [existingSurveyOptions, setExistingSurveyOptions] = useState([]);
  const [columns, setColumns] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const onFinish = values => {
    setSurveyData(values);
    incrStep();
  };

  const onSurveyChange = async ([, surveyId]) => {
    const { data } = await GSPBackend.get(`/surveys/survey/${surveyId}`);
    form.setFieldsValue(data[0]);
  };

  useEffect(async () => {
    const requests = [
      GSPBackend.get('/tables/survey/columns'),
      GSPBackend.get('/surveys/existingSurveyOptions'),
    ];
    const [{ data: columnData }, { data: map }] = await Promise.all(requests);
    setColumns(columnData.map(col => ({ name: col.COLUMN_NAME, type: col.DATA_TYPE })));
    setExistingSurveyOptions([{ label: 'Clear existing survey' }, ...map]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.addDataDiv}>
      <div className={styles.header}>
        <Title className={styles['create-new-survey-header']} level={3}>
          Input information for a new survey
        </Title>
        <Cascader
          className={styles.cascader}
          options={existingSurveyOptions}
          placeholder="Add data to existing survey"
          onChange={onSurveyChange}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 20 }}
          form={form}
          className={styles.surveyForm}
          layout="vertical"
          style={{ width: '100%' }}
        >
          {columns.map(column => (
            <UserInput key={column.name} column={column} />
          ))}
        </Form>
      </div>
    </div>
  );
};
SurveyForm.propTypes = {
  incrStep: PropTypes.func.isRequired,
  setSurveyData: PropTypes.func.isRequired,
};

export default SurveyForm;
