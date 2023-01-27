import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/Login/LoginPage';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
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
          <Route exact path="/homepage" element={<HomePage />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/importcsv" element={<ImportCSV />} />
          <Route exact path="/surveys" element={<Surveys />} />
          <Route exact path="/adddata" element={<AddData />} />
          <Route exact path="/data" element={<Data />} />
          <Route exact path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
