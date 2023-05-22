import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import QueryData from './pages/QueryData/QueryData';
import ManageData from './pages/ManageData/ManageData';
import AddData from './pages/AddData/AddData';
import ProtectedRoute from './utils/ProtectedRoute';
import RegisterPage from './pages/Register/RegisterPage';
import ManageColumnsPage from './pages/ManageColumns/ManageColumnsPage';
import ManageUsersPage from './pages/ManageUsers/ManageUsersPage';
import AUTH_ROLES from './utils/auth_config';
import './module.css';
import { AuthContextProvider } from './common/AuthContext';

const { ADMIN_ROLE, INTERN_ROLE } = AUTH_ROLES.AUTH_ROLES;

// TODO: Make routes role protected
function App() {
  return (
    <CookiesProvider>
      <AuthContextProvider>
        <Router>
          <Routes>
            {/* Unprotected routes */}
            <Route exact path="/login" element={<Login />} />

            <Route exact path="/register" element={<RegisterPage />} />
            <Route element={<Layout />}>
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    Component={Dashboard}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, INTERN_ROLE]}
                  />
                }
              />
              <Route
                exact
                path="/manage-columns"
                element={
                  <ProtectedRoute
                    Component={ManageColumnsPage}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, INTERN_ROLE]}
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
                    roles={[ADMIN_ROLE, INTERN_ROLE]}
                  />
                }
              />
              <Route
                exact
                path="/manage-data"
                element={
                  <ProtectedRoute
                    Component={ManageData}
                    redirectPath="/login"
                    roles={[ADMIN_ROLE, INTERN_ROLE]}
                  />
                }
              />
              <Route
                exact
                path="/add-data"
                element={
                  <ProtectedRoute Component={AddData} redirectPath="/login" roles={[ADMIN_ROLE]} />
                }
              />
              <Route
                exact
                path="/manage-users"
                element={
                  <ProtectedRoute
                    Component={ManageUsersPage}
                    redirectPath="/"
                    roles={[ADMIN_ROLE]}
                  />
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthContextProvider>
    </CookiesProvider>
  );
}

export default App;
