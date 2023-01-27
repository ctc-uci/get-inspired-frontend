import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import HomePage from './components/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ManageUsers from './components/ManageUsers/ManageUsers';
import Logout from './components/Logout';
import ProtectedRoute from './utils/ProtectedRoute';
import AUTH_ROLES from './utils/auth_config';

import './App.css';
import RegisterPage from './components/Register/RegisterPage';
import ManageUsersPage from './components/ManageUsers/ManageUsersPage';

const { ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          {/* Routes used for testing */}
          <Route exact path="/registerPage" element={<RegisterPage />} />
          <Route exact path="/ManageUsersPage" element={<ManageUsersPage />} />

          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />

          <Route
            exact
            path="/register"
            element={<ProtectedRoute Component={Register} redirectPath="/" roles={[ADMIN_ROLE]} />}
          />

          <Route
            exact
            path="/manageUsers"
            element={
              <ProtectedRoute Component={ManageUsers} redirectPath="/" roles={[ADMIN_ROLE]} />
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
