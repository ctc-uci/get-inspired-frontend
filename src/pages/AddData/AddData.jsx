import React, { useState, useEffect, useCallback } from 'react';
import { Cascader } from 'antd';
import StepsBar from '../../components/AddData/StepsBar/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV/ImportCSV';
import ReviewForm from '../../components/AddData/ReviewForm/ReviewForm';
import UploadComplete from '../../components/AddData/UploadComplete/UploadComplete';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { clamsTableCols, rakerTableCols } from '../../components/AddData/CSVTableData/CSVTableData';
import { GSPBackend } from '../../utils/utils';
import styles from './AddData.module.css';

const AddData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState({});
  const [csvData, setCsvData] = useState({
    clam: [],
    raker: [],
    clamCols: clamsTableCols,
    rakerCols: rakerTableCols,
  });
  const [curStep, setCurStep] = useState(0);
  const [showNewSurvey] = useState(true);
  const [surveyOptions, setSurveyOptions] = useState([]);

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

  // Load dropdown survey/cascader options on page load
  useEffect(async () => {
    const map = await GSPBackend.get('/surveys/manageDataOptions');
    setSurveyOptions([...map.data]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
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
        {curStep === 0 && (
          <Cascader
            className={styles.cascader}
            options={surveyOptions}
            placeholder="Select existing form"
          />
        )}
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
