import React, { useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Row, Col, Button, Collapse, theme, Table, Form } from 'antd';
import PropTypes from 'prop-types';

import { UserInput } from './ReviewFormUtils';
import EditableCell from '../ImportCSV/EditableCell';
import { GSPBackend, NotiMessage, NotiIcon, notify } from '../../../utils/utils';

import styles from './ReviewForm.module.css';

const { Panel } = Collapse;

const PAGE_SIZE = 8;
const ReviewForm = ({
  incrStep,
  decrStep,
  surveyData,
  csvData,
  selectedExistingSurvey,
  surveyColumns,
}) => {
  const [clamPage, setClamPage] = useState(1);
  const [rakerPage, setRakerPage] = useState(1);
  const { token } = theme.useToken();
  const addData = async () => {
    const [, selectedExistingSurveyId] = selectedExistingSurvey;
    let surveyIdToDeleteOnError = null;
    try {
      const surveyId =
        selectedExistingSurveyId ||
        (await GSPBackend.post('/surveys', surveyData)).data[0].insertId;
      surveyIdToDeleteOnError = surveyId;
      const addClamAndRakerRequests = [
        csvData.clam
          ? GSPBackend.post('/clams', { survey_id: surveyId, rakers: csvData.clam })
          : [],
        csvData.raker
          ? GSPBackend.post('/rakers', { survey_id: surveyId, rakers: csvData.raker })
          : [],
      ];

      await Promise.all(addClamAndRakerRequests);

      incrStep();
    } catch (error) {
      notify(NotiMessage.ADD_DATA_ERROR(error), NotiIcon.ERROR);
      // Delete the survey if it was created
      if (
        (selectedExistingSurveyId === null || selectedExistingSurveyId === undefined) &&
        surveyIdToDeleteOnError
      ) {
        await GSPBackend.delete(`/surveys/${surveyIdToDeleteOnError}`);
      }
    }
  };

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <div className={styles.reviewForm}>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 180 : 0} />}
        expandIconPosition="end"
        style={{ background: token.colorBgContainer }}
      >
        <Panel header="Survey" key="1" style={panelStyle}>
          <Form className={styles['survey-form']} layout="vertical">
            {Object.keys(surveyData).map(key => (
              <UserInput
                key={key}
                columnName={key}
                value={surveyData[key]}
                columnType={surveyColumns[key]}
              />
            ))}
          </Form>
        </Panel>
        <Panel header="Clams" key="2" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={[...csvData.clam]}
            columns={[
              ...csvData.clamCols.map(column => ({
                ...column,
                render: (text, record, index) => (
                  <EditableCell
                    text={text}
                    record={record}
                    index={index + (clamPage - 1) * PAGE_SIZE}
                    typeOfData="clam"
                    csvData={csvData}
                    columnName={column.title}
                    columnType={column.type}
                    autoDisabled
                  />
                ),
              })),
            ]}
            pagination={{ pageSize: PAGE_SIZE, current: clamPage, onChange: setClamPage }}
            rowKey="index"
          />
        </Panel>
        <Panel header="Raker" key="3" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={[...csvData.raker]}
            columns={[
              ...csvData.rakerCols.map(column => ({
                ...column,
                render: (text, record, index) => (
                  <EditableCell
                    text={text}
                    columnName={column.title}
                    columnType={column.type}
                    typeOfData="raker"
                    record={record}
                    csvData={csvData}
                    index={index + (rakerPage - 1) * PAGE_SIZE}
                    autoDisabled
                  />
                ),
              })),
            ]}
            pagination={{ pageSize: PAGE_SIZE, current: rakerPage, onChange: setRakerPage }}
            rowKey="index"
          />
        </Panel>
      </Collapse>

      <Row gutter={16} id={styles.backNextButtons}>
        <Col span={12}>
          <Button type="primary" style={{ background: 'gray' }} onClick={decrStep}>
            Back
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={addData}>
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

ReviewForm.propTypes = {
  incrStep: PropTypes.func.isRequired,
  decrStep: PropTypes.func.isRequired,
  surveyData: PropTypes.shape({}).isRequired,
  csvData: PropTypes.shape({
    clam: PropTypes.arrayOf(PropTypes.shape({})),
    raker: PropTypes.arrayOf(PropTypes.shape({})),
    clamCols: PropTypes.arrayOf(PropTypes.shape({})),
    rakerCols: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  selectedExistingSurvey: PropTypes.arrayOf(PropTypes.string).isRequired,
  surveyColumns: PropTypes.shape({}).isRequired,
};

export default ReviewForm;
