import { GetAuthUrl, GetCategoriesUrl, GetFeedUrl, GetLecturersUrl, GetSubjectsUrl } from './common';
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

export function GetSubject(id, accessToken) {
  return axios.get(GetSubjectsUrl() + `/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetLecturer(id, accessToken) {
  return axios.get(GetLecturersUrl() + `/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostLecturer(id, text, accessToken) {
  return axios.post(
    GetLecturersUrl() + `/review`,
    {
      text: text,
      lecturerId: id,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function PostSubject(id, text, accessToken) {
  return axios.post(
    GetSubjectsUrl() + `/review`,
    {
      text: text,
      subjectId: id,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function PostFile(id, file, accessToken) {
  const form = new FormData();
  form.append('file', file, file.name);
  return axios.post(GetSubjectsUrl() + `/${id}/upload-db`, form, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function GetFile(subjectId, fileId, accessToken, axiosConfig = {}) {
  return axios.get(GetSubjectsUrl() + `/${subjectId}/files/${fileId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    ...axiosConfig,
  });
}

export function GetFeed(offset, limit, accessToken) {
  return axios.get(GetFeedUrl() + `/with-comments?offset=${offset}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostFeed(content, accessToken) {
  return axios.post(
    GetFeedUrl(),
    {
      content: content,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function DeleteFeed(id, accessToken) {
  return axios.delete(GetFeedUrl() + `/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostApproveFeed(id, accessToken) {
  return axios.post(GetFeedUrl() + `/${id}/approve`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostFeedComment(id, content, accessToken) {
  return axios.post(
    GetFeedUrl() + `/${id}/comments`,
    {
      text: content,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function DeleteFeedComment(id, accessToken) {
  return axios.delete(GetFeedUrl() + `/comments/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function DeleteSubjectReview(id, accessToken) {
  return axios.delete(GetSubjectsUrl() + `/review/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostSubjectApprove(id, accessToken) {
  return axios.post(GetSubjectsUrl() + `/review/${id}/approve`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function DeleteLecturer(id, accessToken) {
  return axios.delete(GetSubjectsUrl() + `/review/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostLecturerApprove(id, accessToken) {
  return axios.post(GetSubjectsUrl() + `/review/${id}/approve`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
