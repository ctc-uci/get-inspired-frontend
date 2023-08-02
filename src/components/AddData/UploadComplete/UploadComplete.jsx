import { React } from 'react';
import { Button, Result } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './UploadComplete.module.css';

const UploadComplete = () => {
  return (
    <div className={styles.uploadComplete}>
      <Result
        style={{ backgroundColor: '#E6F7FF', borderRadius: '10px', width: '40%' }}
        icon={<CheckCircleOutlined style={{ marginBottom: '1%' }} />}
        title="Your data has been uploaded!"
        subTitle="Thank you for completing the form. The data will be uploaded and viewable in your records shortly."
        extra={[
          <Button style={{ marginRight: '25px', marginTop: '4%' }} type="primary" key="another">
            <Link to="/add-data" onClick={() => window.location.reload()}>
              Submit Another
            </Link>
          </Button>,
          <Button key="dashboard">
            <Link to="/">Back to Dashboard</Link>
          </Button>,
        ]}
      />
    </div>
  );
};

export default UploadComplete;
