import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Login/Login';
import Logout from './components/Logout';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Data from './pages/Data/Data';
import QueryData from './pages/QueryData/QueryData';
import AddData from './pages/AddData/AddData';
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
          {/* Unprotected routes */}
          <Route
            exact
            path="/login"
            element={<Login roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]} />}
          />

          <Route exact path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
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
            path="/view-data"
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
            path="/query-data"
            element={
              <ProtectedRoute
                Component={QueryData}
                redirectPath="/login"
                roles={[ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE]}
              />
            }
          />

          <Route
            exact
            path="/add-data"
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
            path="/manage-users"
            element={
              <ProtectedRoute Component={ManageUsersPage} redirectPath="/" roles={[ADMIN_ROLE]} />
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
