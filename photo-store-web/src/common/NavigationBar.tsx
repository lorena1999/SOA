import React, { useState } from 'react';
import { API_URL } from '../index';
import AuthService from './AuthService';

function NavigationBar(props: any) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const authService: AuthService = props.authService;
  const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(authService.getUsername().length > 0);

  function handleLogin() {
    if (username.trim() === '' || password.trim() === '') {
      alert("Please provide a non-empty username and password.");
      return;
    }

    const credentials = { username, password };

    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(response => {
        const jwt = response.jwt;
        console.log(`User ${username} is logged in with '${jwt}'`);
        authService.setLoggedUser(username, jwt);
        setUserIsLoggedIn(true);
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong :(");
      });
  }

  function handleLogout() {
    authService.setLoggedUser('', '');
    setUserIsLoggedIn(false);
  }

  return (
    <nav className="navbar navbar-light justify-content-between container-fluid bg-transparent fixed-top">
      <label className="navbar-brand text-white">Photo camera store</label>
      <div className="form-inline">
        {
          userIsLoggedIn
            ?
            <div>
              <label className={"navbar-brand text-white"}>Hi, {authService.getUsername()}!</label>
              <button className="btn btn-outline-light my-2 my-sm-0" onClick={handleLogout}>Logout</button>
            </div>
            :
            <div>
              <input type="text" value={username} placeholder={"Username"} onChange={e => setUsername(e.target.value)}/>
              <input type="password" value={password} placeholder={"Password"} onChange={e => setPassword(e.target.value)}/>
              <button className="btn btn-outline-light my-2 my-sm-0" onClick={handleLogin}>Login</button>
            </div>
        }
      </div>
    </nav>
  );
}

export default NavigationBar;