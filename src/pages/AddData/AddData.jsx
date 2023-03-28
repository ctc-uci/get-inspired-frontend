import React, { useState, useEffect, useCallback } from 'react';
import StepsBar from '../../components/AddData/StepsBar/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV/ImportCSV';
import ReviewForm from '../../components/AddData/ReviewForm/ReviewForm';
import UploadComplete from '../../components/AddData/UploadComplete/UploadComplete';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import { GSPBackend } from '../../utils/utils';

import styles from './AddData.module.css';

const AddData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState({});
  const [surveyColumns, setSurveyColumns] = useState({});
  const [selectedExistingSurvey, setSelectedExistingSurvey] = useState([]);
  const [existingSurveyOptions, setExistingSurveyOptions] = useState([]);
  const [csvData, setCsvData] = useState({
    clam: [],
    raker: [],
    clamCols: [],
    rakerCols: [],
  });
  const [curStep, setCurStep] = useState(0);
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

  useEffect(async () => {
    const requests = [
      GSPBackend.get('/tables/survey/columns'),
      GSPBackend.get('/surveys/existingSurveyOptions'),
    ];
    const [{ data: columnData }, { data: map }] = await Promise.all(requests);
    setSurveyColumns(
      columnData.reduce((acc, col) => ({ ...acc, [col.COLUMN_NAME]: col.DATA_TYPE }), {}),
    );
    setExistingSurveyOptions([{ label: 'Create new survey' }, ...map]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.addDataWrapper}>
      <div className={styles.appDataHeading}>
        <h3 style={{ fontFamily: 'Roboto' }}>Add Data Form</h3>
        {curStep < 4 && (
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
      </div>
      {curStep === 0 && (
        <SurveyForm
          existingSurveyOptions={existingSurveyOptions}
          selectedExistingSurvey={selectedExistingSurvey}
          setSelectedExistingSurvey={setSelectedExistingSurvey}
          incrStep={incrStep}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          surveyColumns={surveyColumns}
        />
      )}
      {curStep === 1 && (
        <ImportCSV
          incrStep={incrStep}
          decrStep={decrStep}
          typeOfData="clam"
          csvData={csvData}
          setCsvData={setCsvData}
        />
      )}
      {curStep === 2 && (
        <ImportCSV
          incrStep={incrStep}
          decrStep={decrStep}
          typeOfData="raker"
          csvData={csvData}
          setCsvData={setCsvData}
        />
      )}
      {curStep === 3 && (
        <ReviewForm
          incrStep={incrStep}
          decrStep={decrStep}
          surveyColumns={surveyColumns}
          surveyData={surveyData}
          csvData={csvData}
          selectedExistingSurvey={selectedExistingSurvey}
        />
      )}
      {curStep === 4 && <UploadComplete />}
    </div>
  );
};

export default AddData;
