import { React } from 'react';
import { Button, Result } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

function UploadComplete() {
  return (
    <div className="upload-complete">
      <Result
        style={{ backgroundColor: '#E6F7FF' }}
        icon={<CheckCircleOutlined />}
        title="Your data has been uploaded!"
        subTitle="Thank you for completing the form. The data will be uploaded and viewable in your records shortly."
        extra={[
          <Button type="primary" key="another">
            Submit Another
          </Button>,
          <Button key="dashboard">Back to Dashboard</Button>,
        ]}
      />
    </div>
  );
}

export default UploadComplete;
