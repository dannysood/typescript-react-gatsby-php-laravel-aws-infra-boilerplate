import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Sanctum } from "react-sanctum";
import axios from "axios";
import { LoginButton } from './components/LoginButton';
const sanctumConfig = {
  // Your application URL
  apiUrl: "http://localhost:8080",
  // The following settings are URLS that need to be created in your Laravel application
  // The URL sanctum uses for the csrf cookie
  csrfCookieRoute: "sanctum/csrf-cookie",
  // {email: string, password: string, remember: true | null} get POSTed to here
  signInRoute: "api/login",
  // A POST request is sent to this route to sign the user out
  signOutRoute: "api/logout",
  // Used (GET) for checking if the user is signed in (so this should be protected)
  // The returned object will be avaiable as `user` in the React components.
  userObjectRoute: "api/user",
  // The URL where the OTAP token or recovery code will be sent to (optional).
  // Only needed if you want to use two factor authentication.
  twoFactorChallengeRoute: "two-factor-challenge",
  // An axios instance to be used by react-sanctum (optional). Useful if you for example need to add custom interceptors.
  axiosInstance: axios,
};

export const App = () => {

  return (
    <div className="App">

      <Sanctum
        // @ts-ignore
        config={sanctumConfig}>
        return (
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        )
      </Sanctum>
    </div>
  );
}








