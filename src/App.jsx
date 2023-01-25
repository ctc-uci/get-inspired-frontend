import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import ProtectedRoute from './utils/ProtectedRoute';
import AUTH_ROLES from './utils/auth_config';

import './App.css';

const { ADMIN_ROLE, VIEWER_ROLE, EDITOR_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
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
