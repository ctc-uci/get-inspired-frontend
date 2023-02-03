import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import HomePage from './pages/Home/HomePage';
import Login from './components/Login/Login';
import Logout from './components/Logout';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Surveys from './pages/Surveys/Surveys';
import Data from './pages/Data/Data';
import AddData from './pages/AddData/AddData';
import ImportCSV from './pages/ImportCSV/ImportCSV';
import ProtectedRoute from './utils/ProtectedRoute';
import AUTH_ROLES from './utils/auth_config';

import './App.css';
import RegisterPage from './pages/Register/RegisterPage';
import ManageUsersPage from './pages/ManageUsers/ManageUsersPage';

const { ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/import-csv" element={<ImportCSV />} />
          <Route exact path="/surveys" element={<Surveys />} />
          <Route exact path="/data" element={<Data />} />
          <Route exact path="/data/add" element={<AddData />} />

          <Route
            exact
            path="/login"
            element={
              <ProtectedRoute
                Component={Login}
                redirectPath="/dashboard"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />

          <Route
            exact
            path="/register"
            element={
              <ProtectedRoute Component={RegisterPage} redirectPath="/" roles={[ADMIN_ROLE]} />
            }
          />

          <Route
            exact
            path="/manage-users"
            element={
              <ProtectedRoute Component={ManageUsersPage} redirectPath="/" roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            exact
            path="/admin"
            element={
              <ProtectedRoute Component={Logout} redirectPath="/login" roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            exact
            path="/logout"
            element={
              <ProtectedRoute
                Component={Logout}
                redirectPath="/"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
