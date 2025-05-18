import { GetAuthUrl, GetCategoriesUrl, GetLecturersUrl, GetSubjectsUrl } from './common';
import axios from 'axios';

// let publicKey = import.meta.env.VITE_APP_PUBLIC_KEY;

// // API CALLS

export function PostSignIn(username, password) {
  return axios.post(GetAuthUrl() + `/login`, {
    username: username,
    password: password,
  });
}

export function PostRefreshToken(refreshToken) {
  return axios.post(GetAuthUrl() + `/refresh-token`, {
    refreshToken: refreshToken,
  });
}

export function PostRegister(userName, password, firstName, lastName) {
  return axios.post(GetAuthUrl() + '/register', {
    userName: userName,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });
}

export function GetCategories(accessToken) {
  return axios.get(GetCategoriesUrl(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetSubject(shortName, accessToken) {
  return axios.get(GetSubjectsUrl() + `/${shortName}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetLecturer(id, accessToken) {
  return axios.get(GetLecturersUrl() + `/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
