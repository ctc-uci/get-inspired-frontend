import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Surveys from './pages/Surveys/Surveys';
import Data from './pages/Data/Data';
import ImportCsv from './pages/ImportCsv/ImportCsv';
import AddData from './pages/Data/Add/AddData';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/" element={<loginP />} />
          <Route exact path="/Profile" element={<Profile />} />
          <Route exact path="/ImportCsv" element={<ImportCsv />} />
          <Route exact path="/Surveys" element={<Surveys />} />
          <Route exact path="/Data/Add" element={<AddData />} />
          <Route exact path="/Data" element={<Data />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
