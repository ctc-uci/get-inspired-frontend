import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes, instanceOf } from 'prop-types';
import LoadingScreen from '../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from './utils';
import { withCookies, cookieKeys, Cookies, clearCookies } from './cookie_utils';
import { refreshToken } from './auth_utils';
import { useAuthContext } from '../common/AuthContext';

const userIsAuthenticated = async (roles, cookies) => {
  try {
    const { accessToken, currentUser } = await refreshToken(cookies);
    if (!accessToken) {
      return false;
    }
    const loggedIn = await GSPBackend.get(`/auth/verifyToken/${accessToken}`);
    return {
      authenticated: roles.includes(cookies.get(cookieKeys.ROLE)) && loggedIn.status === 200,
      currentUser,
    };
  } catch (err) {
    clearCookies(cookies);
    return false;
  }
};

/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component the user is trying to access
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @param {Array} roles A list of roles that are allowed to access the route
 * @param {Cookies} cookies The user's current cookies
 * @returns The relevant path to redirect the user to depending on authentication state.
 */
const ProtectedRoute = ({ Component, redirectPath, roles, cookies }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setCurrentUser } = useAuthContext();

  useEffect(async () => {
    const { authenticated, currentUser } = await userIsAuthenticated(roles, cookies);
    setIsAuthenticated(authenticated);
    setCurrentUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Component />;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  redirectPath: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ProtectedRoute);
