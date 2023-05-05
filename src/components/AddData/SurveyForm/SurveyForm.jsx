import React, { useEffect } from 'react';
import { Button, Form, Typography, Cascader } from 'antd';
import PropTypes from 'prop-types';
import { fieldValueBuilder, UserInput } from './SurveyFormUtils';
import { GSPBackend } from '../../../utils/utils';

import styles from './SurveyForm.module.css';

const { Title } = Typography;

const SurveyForm = ({
  incrStep,
  surveyColumns,
  existingSurveyOptions,
  surveyData,
  setSurveyData,
  selectedExistingSurvey,
  setSelectedExistingSurvey,
}) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    setSurveyData(form.getFieldsValue());
    incrStep();
  };

  const onSurveyChange = async ([year, surveyId]) => {
    if (surveyId) {
      const { data } = await GSPBackend.get(`/surveys/survey/${surveyId}`);
      form.setFieldsValue(
        Object.keys(data[0]).reduce(
          (acc, key) => ({
            ...acc,
            [key]: fieldValueBuilder(data[0][key], surveyColumns[key]),
          }),
          {},
        ),
      );
      setSelectedExistingSurvey([year, surveyId]);
    } else {
      form.resetFields();
      setSelectedExistingSurvey([]);
    }
  };

  useEffect(() => {
    if (surveyData) {
      form.setFieldsValue(surveyData);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttons}>
          <Cascader
            className={styles.cascader}
            options={existingSurveyOptions}
            placeholder="Add data to existing survey"
            value={selectedExistingSurvey}
            onChange={onSurveyChange}
          />
          <Button
            onClick={() => {
              form.resetFields();
              setSelectedExistingSurvey([]);
            }}
          >
            Clear existing survey information
          </Button>
        </div>
        <Title className={styles['create-new-survey-header']} level={3}>
          Input information for a survey
        </Title>
      </div>
      <Form className={styles['survey-form']} form={form} layout="vertical" onFinish={onFinish}>
        {Object.keys(surveyColumns)
          .filter(columnName => columnName !== 'id')
          .map(columnName => (
            <UserInput
              key={columnName}
              columnName={columnName}
              columnType={surveyColumns[columnName]}
              selectedExistingSurvey={selectedExistingSurvey}
            />
          ))}
        <Form.Item style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

SurveyForm.propTypes = {
  incrStep: PropTypes.func.isRequired,
  surveyColumns: PropTypes.shape({}).isRequired,
  surveyData: PropTypes.shape({}).isRequired,
  setSurveyData: PropTypes.func.isRequired,
  setSelectedExistingSurvey: PropTypes.func.isRequired,
  existingSurveyOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedExistingSurvey: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SurveyForm;
