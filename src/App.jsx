import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Login/Login';
import Logout from './components/Logout';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Data from './pages/Data/Data';
import AddData from './pages/AddData/AddData';
import ProtectedRoute from './utils/ProtectedRoute';
import RegisterPage from './pages/Register/RegisterPage';
import ManageUsersPage from './pages/ManageUsers/ManageUsersPage';
import AUTH_ROLES from './utils/auth_config';
import './module.css';

const { ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE } = AUTH_ROLES.AUTH_ROLES;
import ManageAttributes from './pages/ManageAttributes/ManageAttributes';

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
          <Route element={<Layout />}>
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
              path="/manage-attributes"
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
              path="/manage-data"
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
          </Route>
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
          <Route exact path="/manage-attributes" element={<ManageAttributes />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
