import { React } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Row, Col, Button, Collapse, theme, Table } from 'antd';
import PropTypes from 'prop-types';

import { GSPBackend } from '../../../utils/utils';

import styles from './ReviewForm.module.css';

const { Panel } = Collapse;

function ReviewForm({ incrStep, decrStep, surveyData, csvData }) {
  const { token } = theme.useToken();

  const addData = async () => {
    const surveyId = (await GSPBackend.post('/surveys', surveyData)).data[0].insertId;

    const addClamAndRakerRequests = [
      ...(csvData.clam
        ? csvData.clam.map(clamData => GSPBackend.post('/clams', { surveyId, ...clamData }))
        : []),
      ...(csvData.raker
        ? csvData.raker.map(rakerData => GSPBackend.post('/rakers', { surveyId, ...rakerData }))
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
          <p>Show review data here</p>
        </Panel>
        <Panel header="Clams" key="2" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={csvData.clam}
            columns={csvData.clamCols}
            pagination={{ pageSize: 2 }}
          />
        </Panel>
        <Panel header="Raker" key="3" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={csvData.raker}
            columns={csvData.rakerCols}
            pagination={{ pageSize: 2 }}
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

ReviewForm.defaultProps = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
};

ReviewForm.propTypes = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
  surveyData: PropTypes.shape({}).isRequired,
  csvData: PropTypes.shape({
    clam: PropTypes.arrayOf(PropTypes.shape({})),
    raker: PropTypes.arrayOf(PropTypes.shape({})),
    clamCols: PropTypes.arrayOf(PropTypes.shape({})),
    rakerCols: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default ReviewForm;
