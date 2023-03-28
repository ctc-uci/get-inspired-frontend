import React, { useState, useEffect } from 'react';
import { Button, Form, Typography, Cascader } from 'antd';
import PropTypes from 'prop-types';
import { fieldValueBuilder, UserInput } from './SurveyFormUtils';
import LoadingScreen from '../../../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from '../../../utils/utils';

import styles from './SurveyForm.module.css';

const { Title } = Typography;

const SurveyForm = ({ incrStep, setSurveyData }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [existingSurveyOptions, setExistingSurveyOptions] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  // Mapping of column name --> column type
  const [columns, setColumns] = useState({});
  // eslint-disable-next-line no-unused-vars
  const onFinish = () => {
    setSurveyData(form.getFieldsValue());
    incrStep();
  };

  const onSurveyChange = async ([, surveyId]) => {
    if (surveyId) {
      const { data } = await GSPBackend.get(`/surveys/survey/${surveyId}`);
      form.setFieldsValue(
        Object.keys(data[0]).reduce(
          (acc, key) => ({
            ...acc,
            [key]: fieldValueBuilder(data[0][key], columns[key]),
          }),
          {},
        ),
      );
      setSelectedSurveyId(surveyId);
    } else {
      form.resetFields();
      setSelectedSurveyId(null);
    }
  };

  useEffect(async () => {
    const requests = [
      GSPBackend.get('/tables/survey/columns'),
      GSPBackend.get('/surveys/existingSurveyOptions'),
    ];
    const [{ data: columnData }, { data: map }] = await Promise.all(requests);
    setColumns(columnData.reduce((acc, col) => ({ ...acc, [col.COLUMN_NAME]: col.DATA_TYPE }), {}));
    setExistingSurveyOptions([{ label: 'Clear existing survey' }, ...map]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.container}>
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
      <Form className={styles['survey-form']} form={form} layout="vertical">
        {Object.keys(columns).map(columnName => (
          <UserInput
            className={styles['user-input']}
            key={columnName}
            columnName={columnName}
            columnType={columns[columnName]}
            selectedSurveyId={selectedSurveyId}
          />
        ))}
      </Form>
      <Button type="primary" onClick={onFinish}>
        Next
      </Button>
    </div>
  );
};
SurveyForm.propTypes = {
  incrStep: PropTypes.func.isRequired,
  setSurveyData: PropTypes.func.isRequired,
};

export default SurveyForm;
