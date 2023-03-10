import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import StepsBar from '../../components/AddData/StepsBar/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV/ImportCSV';
import ReviewForm from '../../components/AddData/ReviewForm/ReviewForm';
import UploadComplete from '../../components/AddData/UploadComplete/UploadComplete';
import styles from './AddData.module.css';

const AddData = () => {
  const [curStep, setCurStep] = useState(0);
  const [showChooseSurveyButtons, setShowChooseSurveyButtons] = useState(true);
  const [showNewSurvey, setShowNewSurvey] = useState(false);
  const [showExistingSurvey, setShowExistingSurvey] = useState(false);

  const handleCreateNewSurvey = () => {
    setShowChooseSurveyButtons(false);
    setShowNewSurvey(true);
  };
  const handleAddToExistingSurvey = () => {
    setShowChooseSurveyButtons(false);
    setShowExistingSurvey(true);
  };
  const incrStep = useCallback(() => {
    setCurStep(prevStep => {
      return prevStep + 1;
    });
  });
  const decrStep = useCallback(() => {
    setCurStep(prevStep => {
      return prevStep - 1;
    });
  });

  return (
    <div className={styles.addDataWrapper}>
      <div className={styles.appDataHeading}>
        <h3 style={{ fontFamily: 'Roboto, sans-serif' }}>Add Data Form</h3>
        {showChooseSurveyButtons && (
          <div className={styles.chooseSurveyBtnsDiv}>
            {showChooseSurveyButtons && (
              <Button
                className={styles.chooseSurveyBtns}
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleAddToExistingSurvey()}
              >
                Add to existing survey
              </Button>
            )}
            {showChooseSurveyButtons && (
              <Button
                className={styles.chooseSurveyBtns}
                type="primary"
                icon={<FileAddOutlined />}
                onClick={() => handleCreateNewSurvey()}
              >
                Create new survey
              </Button>
            )}
          </div>
        )}
        {showNewSurvey && curStep < 4 && (
          <StepsBar
            curStep={curStep}
            titleArray={[
              { title: 'Survey' },
              { title: 'Clams' },
              { title: 'Raker' },
              { title: 'Review' },
            ]}
          />
        )}
        {showExistingSurvey && curStep < 3 && (
          <StepsBar
            curStep={curStep}
            titleArray={[{ title: 'Select' }, { title: 'Upload' }, { title: 'Preview' }]}
          />
        )}
      </div>
      {showNewSurvey && curStep === 0 && <SurveyForm incrStep={incrStep} />}
      {showNewSurvey && curStep === 1 && (
        <ImportCSV incrStep={incrStep} decrStep={decrStep} typeOfData="Clams" />
      )}
      {showNewSurvey && curStep === 2 && (
        <ImportCSV incrStep={incrStep} decrStep={decrStep} typeOfData="Raker" />
      )}
      {showNewSurvey && curStep === 3 && <ReviewForm incrStep={incrStep} decrStep={decrStep} />}
      {showNewSurvey && curStep === 4 && <UploadComplete />}
    </div>
  );
};

export default AddData;
