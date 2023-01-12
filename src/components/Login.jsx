import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../utils/cookie_utils';
import { logInWithEmailAndPassword, useNavigate } from '../utils/auth_utils';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h1>Get Inspired</h1>
      <h2> Login: </h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <p>Email</p>
        <input
          id="email"
          onChange={({ target }) => setEmail(target.value)}
          type="text"
          placeholder="Enter email:"
        />
        <p>Password</p>
        <input
          id="password"
          onChange={({ target }) => setPassword(target.value)}
          type="text"
          placeholder="Enter password:"
        />
        <br /> <br /> &nbsp;
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);
