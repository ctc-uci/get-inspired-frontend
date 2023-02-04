import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
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
          <Route
            path="/"
            element={
              <ProtectedRoute
                Component={Dashboard}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <ProtectedRoute
                Component={Profile}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/import-csv"
            element={
              <ProtectedRoute
                Component={ImportCSV}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/surveys"
            element={
              <ProtectedRoute
                Component={Surveys}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/data"
            element={
              <ProtectedRoute
                Component={Data}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />
          <Route
            exact
            path="/data/add"
            element={
              <ProtectedRoute
                Component={AddData}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />

          <Route
            exact
            path="/login"
            element={<Login roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]} />}
          />

          <Route exact path="/register" element={<RegisterPage />} />

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
                redirectPath="/login"
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
