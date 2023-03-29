import { React } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Row, Col, Button, Collapse, theme, Table, Form } from 'antd';
import PropTypes from 'prop-types';

import { UserInput } from './ReviewFormUtils';
import EditableCell from '../ImportCSV/EditableCell';
import { GSPBackend } from '../../../utils/utils';

import styles from './ReviewForm.module.css';

const { Panel } = Collapse;

function ReviewForm({
  incrStep,
  decrStep,
  surveyData,
  csvData,
  selectedExistingSurvey,
  surveyColumns,
}) {
  const { token } = theme.useToken();

  const addData = async () => {
    const [, selectedExistingSurveyId] = selectedExistingSurvey;
    const surveyId =
      selectedExistingSurveyId || (await GSPBackend.post('/surveys', surveyData)).data[0].insertId;

    const addClamAndRakerRequests = [
      ...(csvData.clam
        ? csvData.clam.map(clamData =>
            GSPBackend.post('/clams', { survey_id: surveyId, ...clamData }),
          )
        : []),
      ...(csvData.raker
        ? csvData.raker.map(rakerData =>
            GSPBackend.post('/rakers', { survey_id: surveyId, ...rakerData }),
          )
        : []),
    ];

    await Promise.all(addClamAndRakerRequests);

    incrStep();
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
                    columnType={column.type}
                    index={index}
                    autoDisabled
                  />
                ),
              })),
            ]}
            pagination={{ pageSize: 8 }}
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
                    columnType={column.type}
                    record={record}
                    index={index}
                    autoDisabled
                  />
                ),
              })),
            ]}
            pagination={{ pageSize: 8 }}
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
}

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
