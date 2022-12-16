import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/profile/profile';
import Surveys from './pages/surveys/surveys';
import Data from './pages/data/data';
import ImportCsv from './pages/importcsv/importcsv';
import AddData from './pages/adddata/adddata';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/" element={<loginP />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/importcsv" element={<ImportCsv />} />
          <Route exact path="/surveys" element={<Surveys />} />
          <Route exact path="/data" element={<Data />} />
          <Route exact path="/adddata" element={<AddData />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
