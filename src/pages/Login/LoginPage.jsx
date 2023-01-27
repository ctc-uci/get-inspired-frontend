import React from 'react';

const LoginPage = () => {
  function handleChange(e) {
    if (e.target.id === 'email') {
      console.log('email being typed');
    } else {
      console.log('password being typed');
    }
  }
  return (
    <div>
      <h1>Get Inspired</h1>
      <h2> Login: </h2>
      <p>Email</p>
      <input id="email" onChange={handleChange} type="text" placeholder="Enter email:" />
      <p>Password</p>
      <input id="password" onChange={handleChange} type="text" placeholder="Enter password:" />
      <br /> <br /> &nbsp;
      <button type="submit">Create Account</button>
    </div>
  );
};

export default LoginPage;
