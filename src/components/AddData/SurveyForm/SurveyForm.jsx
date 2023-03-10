import { React } from 'react';
import { Form, Row, Col, Input, InputNumber, Button, DatePicker, TimePicker, Space } from 'antd';
import PropTypes from 'prop-types';
import styles from './SurveyForm.module.css';

function SurveyForm({ incrStep }) {
  // eslint-disable-next-line no-unused-vars
  const onFinish = values => {
    incrStep();
  };

  const onlyInputNumbers = event => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.addDataDiv}>
      <p style={{ fontWeight: '600' }}>Input basic information for your survey</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 20 }}
          className={styles.surveyForm}
          layout="vertical"
          style={{ width: '100%' }}
        >
          <div style={{ marginLeft: '6.5%' }}>
            <Row>
              <Col span={12}>
                <Form.Item label="Beach" name="beach">
                  <Input placeholder="Newport Beach" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Water Depth" name="waterDepth">
                  <InputNumber
                    placeholder="1.5 feet"
                    onKeyPress={onlyInputNumbers}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Start Time" name="startTime">
                  <TimePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tide" name="tide">
                  <Input placeholder="High" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Survey Location" name="surveyLocation">
                  <Input placeholder="3029 Ocean Blvd, Corona Del Mar, CA" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Duration" name="duration">
                  <InputNumber
                    placeholder="2 hours"
                    onKeyPress={onlyInputNumbers}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Method" name="method">
                  <Input placeholder="Method 1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Distance" name="distance">
                  <InputNumber
                    placeholder="35 feet"
                    onKeyPress={onlyInputNumbers}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Date" name="date">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <DatePicker style={{ width: '100%' }} />
                  </Space>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Slope" name="slope">
                  <InputNumber
                    placeholder="5 feet"
                    onKeyPress={onlyInputNumbers}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col style={{ marginLeft: '43%', marginTop: '3%' }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
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
