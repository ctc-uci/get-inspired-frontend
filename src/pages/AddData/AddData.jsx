import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import StepsBar from '../../components/AddData/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV';
import ReviewForm from '../../components/AddData/ReviewForm';
import UploadComplete from '../../components/AddData/UploadComplete';
import './AddData.css';

const AddData = () => {
  const [curStep, setCurStep] = useState(0);
  const [showChooseSurveyButtons, setShowChooseSurveyButtons] = useState(true);
  const [showExistingSurvey, setShowExistingSurvey] = useState(false);

  const handleCreateNewSurvey = useCallback(() => {
    setShowChooseSurveyButtons(false);
    setShowExistingSurvey(true);
  });
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
    <div className="add-data-wrapper">
      <div className="app-data-heading">
        <h3 style={{ fontFamily: 'Roboto' }}>Add Data Form</h3>
        {showChooseSurveyButtons && (
          <div className="choose-survey-btns-div">
            {showChooseSurveyButtons && (
              <Button className="choose-survey-btns" type="primary" icon={<EditOutlined />}>
                Add to existing survey
              </Button>
            )}
            {showChooseSurveyButtons && (
              <Button
                className="choose-survey-btns"
                type="primary"
                icon={<FileAddOutlined />}
                onClick={() => handleCreateNewSurvey()}
              >
                Create new survey
              </Button>
            )}
          </div>
        )}
        {showExistingSurvey && curStep < 4 && <StepsBar curStep={curStep} />}
      </div>
      {showExistingSurvey && curStep === 0 && <SurveyForm incrStep={incrStep} />}
      {showExistingSurvey && curStep === 1 && (
        <ImportCSV incrStep={incrStep} decrStep={decrStep} typeOfData="Clams" />
      )}
      {showExistingSurvey && curStep === 2 && (
        <ImportCSV incrStep={incrStep} decrStep={decrStep} typeOfData="Raker" />
      )}
      {showExistingSurvey && curStep === 3 && (
        <ReviewForm incrStep={incrStep} decrStep={decrStep} />
      )}
      {showExistingSurvey && curStep === 4 && <UploadComplete />}
    </div>
  );
};

export default AddData;
