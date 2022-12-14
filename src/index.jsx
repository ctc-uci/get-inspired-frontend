import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './pages/Dashboard/Dashboard';
import profile from './pages/profile/profile';
import loginP from './pages/loginP/loginP';
import surveys from './pages/surveys/surveys';
import data from './pages/data/data';
import importcsv from './pages/importcsv/importcsv';
import adddata from './pages/adddata/adddata';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/" element={<loginP />} />

        <Route element={<Layout isAdmin />}>
          <Route
            exact
            path="/profile"
            element={<ProtectedRoute Component={profile} redirectPath="/login" />}
          />
          <Route
            exact
            path="/import-csv"
            element={<ProtectedRoute Component={importcsv} redirectPath="/login" />}
          />
          <Route
            exact
            path="/surveys"
            element={<ProtectedRoute Component={surveys} redirectPath="/login" />}
          />
          <Route
            exact
            path="/data"
            element={<ProtectedRoute Component={data} redirectPath="/login" />}
          />
          <Route
            exact
            path="/adddata"
            element={<ProtectedRoute Component={adddata} redirectPath="/login" />}
          />
        </Route>

      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
