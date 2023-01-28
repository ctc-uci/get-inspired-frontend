import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/Profile/Profile';
import Surveys from './pages/Surveys/Surveys';
import Data from './pages/Data/Data';
import ImportCSV from './pages/ImportCSV/ImportCSV';
import AddData from './pages/AddData/AddData';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/import-csv" element={<ImportCSV />} />
          <Route exact path="/surveys" element={<Surveys />} />
          <Route exact path="/data/add" element={<AddData />} />
          <Route exact path="/data" element={<Data />} />
          <Route exact path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
