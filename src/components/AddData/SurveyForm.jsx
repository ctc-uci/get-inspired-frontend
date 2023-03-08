import { React } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, TimePicker, Space } from 'antd';
import PropTypes from 'prop-types';

function SurveyForm({ incrStep }) {
  const onFinish = values => {
    console.log('Success:', values);
    incrStep();
  };

  const onlyInputNumbers = event => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="add-data-div">
      <p style={{ fontWeight: '600' }}>Input basic information for your survey</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 20 }}
          className="survey-form"
          onFinish={onFinish}
          layout="vertical"
          style={{ width: '100%' }}
        >
          <div style={{ marginLeft: '6.5%' }}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Beach"
                  rules={[
                    { required: true, type: 'string', message: 'Please include the beach name' },
                  ]}
                >
                  <Input placeholder="Newport Beach" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Water Depth">
                  <Input placeholder="1.5 feet" onKeyPress={onlyInputNumbers} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Start Time">
                  {/* <Input placeholder="12:00 PM" /> */}
                  <TimePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tide">
                  <Input placeholder="High" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Survey Location">
                  <Input placeholder="3029 Ocean Blvd, Corona Del Mar, CA" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Duration">
                  <Input placeholder="2 hours" onKeyPress={onlyInputNumbers} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Method">
                  <Input placeholder="Method 1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Distance">
                  <Input placeholder="35 feet" onKeyPress={onlyInputNumbers} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Date">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <DatePicker style={{ width: '100%' }} />
                  </Space>
                  {/* <Input placeholder="11/13/2002" /> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Slope">
                  <Input placeholder="5 feet" onKeyPress={onlyInputNumbers} />
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
