import { React } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import PropTypes from 'prop-types';

function SurveyForm({ incrStep }) {
  return (
    <div className="survey-form-div">
      <p style={{ fontWeight: '600' }}>
        Welcome to the Survey Form! [Mini explanation of this section of the form]
      </p>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="survey-form">
        <Row>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Beach</p>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Water Depth</p>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Start Time</p>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Tide</p>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Survey Location</p>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Duration</p>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Method</p>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Distance</p>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Date</p>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <p className="survey-form-entry-label">Slope</p>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button type="primary" onClick={incrStep}>
        Next
      </Button>
    </div>
  );
}

SurveyForm.defaultProps = {
  incrStep: PropTypes.func,
};

SurveyForm.propTypes = {
  incrStep: PropTypes.func,
};

export default SurveyForm;
