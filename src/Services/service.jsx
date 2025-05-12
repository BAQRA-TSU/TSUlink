import { GetPaymentUrl, GetSsoUrl, GetVeriffUrl, GetWebApiUrl } from './common';
import axios from 'axios';

let publicKey = import.meta.env.VITE_APP_PUBLIC_KEY;

// // API CALLS

export function PostSignIn(username, password) {
  return axios.post(
    GetSsoUrl() + `/login`,
    {
      username: username,
      password: password,
    }
  );
}

export function PostRefreshToken(refreshToken) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/token/refresh`,
    {
      refresh_token: refreshToken,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PostAddNewCard(accessToken, processorName, otp, amount, saveCard) {
  return axios.post(
    GetWebApiUrl() + `/api/v1/payment`,
    {
      language: 'ka',
      currency: 'GEL',
      theme: 'dark',
      paymentVendor: processorName,
      code: otp,
      saveCard: saveCard,
      paymentType: 'DEPOSIT',
      amount: amount,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function DeleteCard(cardId, accessToken) {
  return axios.delete(GetPaymentUrl() + `/payments/card/${cardId}`, {
    params: { accessToken },
    headers: { 'x-public-key': publicKey },
  });
}

export function PostSendCode(phone) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/registration/send`,
    {
      phone: phone,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PostSendPhoneUpdateCode(accessToken, phone) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/send`,
    {
      phone: phone,
    },
    {
      headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
    }
  );
}

export function PostSendPasswordUpdateCode(accessToken) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/passwordUpdate/send`,
    {},
    {
      headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
    }
  );
}

export function PostSendPaymentCode(accessToken) {
  return axios.post(GetWebApiUrl() + `/api/v1/payment/send/otp`, undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostSendResetCode(phone, username) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/resetpassword/send`,
    {
      phone: phone,
      username: username,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PostPhoneCheck(phone, code, yarOfBirth, citizenship, personalId) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/registration/check`,
    {
      phone: phone,
      code: code,
      dateOfBirth: yarOfBirth,
      citizenship: citizenship,
      personalId: personalId,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PatchPhoneUpdateCheck(accessToken, phone, code, personalId, password) {
  return axios.patch(
    GetSsoUrl() + `/api/v1/accounts/phone`,
    {
      phone: phone,
      code: code,
      personalId: personalId,
      password: password,
    },
    {
      headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
    }
  );
}

export function PostPasswordUpdateCheck(accessToken, currentPassword, newPassword, code) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/password/update`,
    {
      currentPassword: currentPassword,
      newPassword: newPassword,
      code: code,
    },
    {
      headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
    }
  );
}

export function PostResetPhoneCheck(newPassword, code, phone) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/password/reset`,
    {
      newPassword: newPassword,
      code: code,
      phone: phone,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PostRecoverySend(phone, id) {
  return axios.post(
    GetSsoUrl() + `/v1/auth/otp/phone/recovery/send`,
    {
      phone: phone,
      personalId: id,
    },
    {
      headers: { 'x-public-key': publicKey },
    }
  );
}

export function PostRegister(userName, password, firstName, lastName) {
  return axios.post(
    GetSsoUrl() + '/register',
    {
      userName: userName,
      password: password,
      firstName: firstName,
      lastName: lastName
    }
  );
}

export function GetCards(accessToken) {
  return axios.get(GetPaymentUrl() + `/payments/cards`, {
    headers: { 'x-public-key': publicKey },
    params: { accessToken },
  });
}

export function GetGames(start = -1, stop = 0, type) {
  return axios.get(GetWebApiUrl() + `/api/v1/games`, {
    params: {
      start: start,
      stop: stop,
      type: type,
    },
  });
}

export function GetAviatorGames() {
  return axios.get(GetWebApiUrl() + `/api/v1/games/aviator/list`);
}

export function PostActivity(accessToken, activityType, gameId) {
  return axios.post(
    GetWebApiUrl() + `/api/v1/activity`,
    {
      activityType: activityType,
      gameId: gameId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function DeleteActivity(accessToken, gameId) {
  return axios.delete(GetWebApiUrl() + `/api/v1/activity`, {
    data: { gameId: gameId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetActivity(accessToken, activityType) {
  return axios.get(GetWebApiUrl() + `/api/v1/activity?activity=${activityType}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetWallet(accessToken) {
  return axios.get(GetWebApiUrl() + `/api/v1/wallet`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PostWallet(accessToken, amount, type, processorName, cardId) {
  return axios.post(
    GetWebApiUrl() + '/api/v1/payment',
    {
      paymentVendor: processorName,
      paymentType: type,
      amount: amount,
      cardId: cardId,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

export function GetMe(accessToken) {
  return axios.get(GetSsoUrl() + `/v1/auth/me`, {
    headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
  });
}

export function GetGameUrl(accessToken, id) {
  return axios.get(GetWebApiUrl() + `/api/v1/games/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

export function PostVeirff(accessToken) {
  return axios.post(GetVeriffUrl() + `/veriff`, undefined, {
    params: { accessToken },
  });
}

export function PostVeriffSesion(accessToken, isReset) {
  return axios.post(
    GetVeriffUrl() + `/get-session`,
    {
      reset: isReset,
    },
    {
      params: { accessToken },
    }
  );
}

export function PatchUser(accessToken, key, value) {
  return axios.patch(
    GetSsoUrl() + `/api/v1/accounts/details`,
    {
      [key]: value,
    },
    {
      headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
    }
  );
}

export function PostImage(accessToken, sessionId, base64Image, docType) {
  return axios.post(
    GetVeriffUrl() + `/veriff/upload`,
    {
      sessionId: sessionId,
      file: base64Image,
      context: docType,
    },
    {
      params: { accessToken },
    }
  );
}

export function PostImageSubmit(accessToken, sessionId) {
  return axios.post(
    GetVeriffUrl() + `/veriff/submit`,
    {
      sessionId: sessionId,
    },
    {
      params: { accessToken },
    }
  );
}

export function GetNotifications(accessToken) {
  return axios.get(GetWebApiUrl() + `/api/v1/notifications/inbox`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function PatchNotifications(accessToken, id) {
  return axios.patch(GetWebApiUrl() + `/api/v1/notifications/${id}`, undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetOneNotification(accessToken, id) {
  return axios.get(GetWebApiUrl() + `/api/v1/notifications/notification/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetTransactions(accessToken, offset = 0, limit = 20, type, startDate, endDate, providers) {
  return axios.get(GetWebApiUrl() + `/api/v1/transactions`, {
    params: {
      limit: limit,
      offset: offset,
      type: type,
      provider: providers ? providers : undefined,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetOneTransaction(accessToken, id, offset = 0, limit = 20) {
  return axios.get(GetWebApiUrl() + `/api/v1/transactions/session/${id}`, {
    params: {
      limit: limit,
      offset: offset,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetAccountLogins(accessToken) {
  return axios.get(GetSsoUrl() + `/v1/auth/logins`, {
    headers: { 'x-public-key': publicKey, Authorization: `Beaerer ${accessToken}` },
  });
}

export function GetLoyaltyList() {
  return axios.get(GetWebApiUrl() + `/api/v1/loyalty/list`);
}

export function GetLoyalty(accessToken) {
  return axios.get(GetWebApiUrl() + `/api/v1/loyalty`, {
    undefined,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function GetLoyaltyTransactions(accessToken, offset = 0, limit = 20, startDate, endDate) {
  return axios.get(GetWebApiUrl() + '/api/v1/transactions/loyalties', {
    params: {
      limit: limit,
      offset: offset,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
