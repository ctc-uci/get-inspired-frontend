import React, { useState, useCallback } from 'react';
import StepsBar from '../../components/AddData/StepsBar/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV/ImportCSV';
import ReviewForm from '../../components/AddData/ReviewForm/ReviewForm';
import UploadComplete from '../../components/AddData/UploadComplete/UploadComplete';
import { clamsTableCols, rakerTableCols } from '../../components/AddData/CSVTableData/CSVTableData';
import styles from './AddData.module.css';

const AddData = () => {
  const [surveyData, setSurveyData] = useState({});
  const [csvData, setCsvData] = useState({
    clam: [],
    raker: [],
    clamCols: clamsTableCols,
    rakerCols: rakerTableCols,
  });
  const [curStep, setCurStep] = useState(0);
  const [showNewSurvey] = useState(true);
  // const [showExistingSurvey, setShowExistingSurvey] = useState(false);

  // const handleCreateNewSurvey = () => {
  //   setShowNewSurvey(true);
  // };
  // const handleAddToExistingSurvey = () => {
  //   setShowExistingSurvey(true);
  // };
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
        {/* {showExistingSurvey && curStep < 3 && (
          <StepsBar
            curStep={curStep}
            titleArray={[{ title: 'Select' }, { title: 'Upload' }, { title: 'Preview' }]}
          />
        )} */}
      </div>
      {showNewSurvey && curStep === 0 && (
        <SurveyForm incrStep={incrStep} surveyData={surveyData} setSurveyData={setSurveyData} />
      )}
      {showNewSurvey && curStep === 1 && (
        <ImportCSV
          incrStep={incrStep}
          decrStep={decrStep}
          typeOfData="clam"
          csvData={csvData}
          setCsvData={setCsvData}
        />
      )}
      {showNewSurvey && curStep === 2 && (
        <ImportCSV
          incrStep={incrStep}
          decrStep={decrStep}
          typeOfData="raker"
          csvData={csvData}
          setCsvData={setCsvData}
        />
      )}
      {showNewSurvey && curStep === 3 && (
        <ReviewForm
          incrStep={incrStep}
          decrStep={decrStep}
          surveyData={surveyData}
          csvData={csvData}
        />
      )}
      {showNewSurvey && curStep === 4 && <UploadComplete />}
    </div>
  );
};

export default AddData;
