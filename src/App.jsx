import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Surveys from './pages/Surveys/Surveys';
import Data from './pages/Data/Data';
import ImportCsv from './pages/ImportCSV/ImportCSV';
import AddData from './pages/AddData/AddData';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/importcsv" element={<ImportCsv />} />
          <Route exact path="/surveys" element={<Surveys />} />
          <Route exact path="/adddata" element={<AddData />} />
          <Route exact path="/data" element={<Data />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
