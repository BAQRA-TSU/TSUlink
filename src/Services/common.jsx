import { isMobile } from 'react-device-detect';
import { useMedia } from 'use-media';
import {
  GetCategories,
  GetFeed,
  GetFile,
  GetLecturer,
  GetSubject,
  PostFeed,
  PostFeedComment,
  PostFile,
  PostLecuter,
  PostRefreshToken,
  PostSignIn,
  PostSubject,
} from './service';

console.log(import.meta.env);

let authUrl = import.meta.env.VITE_APP_AUTH_URL;
let categoriesUrl = import.meta.env.VITE_APP_CATEGORIES_URL;
let lecturersUrl = import.meta.env.VITE_APP_LECTURERS_URL;
let subjectsUrl = import.meta.env.VITE_APP_SUBJECTS_URL;
let feedUrl = import.meta.env.VITE_APP_FEED_URL;

// const locale = {};

export const GetAuthUrl = () => {
  return authUrl;
};

export const GetCategoriesUrl = () => {
  return categoriesUrl;
};

export const GetLecturersUrl = () => {
  return lecturersUrl;
};

export const GetSubjectsUrl = () => {
  return subjectsUrl;
};

export const GetFeedUrl = () => {
  return feedUrl;
};

// export const GetStaticContentBaseUrl = () => {
//     return staticContentUrl;
// };

export const IsLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const ConsoleLog = (msg) => {
  if (!IsLocalhost) return;
  console.log(msg);
};

export const GetCurrentTime = (time) => {
  let countDownDate = new Date(time).getTime();
  let now = new Date().getTime();

  let distance = countDownDate - now;
  let expired = distance < 0;

  let days = expired ? 0 : Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = expired ? 0 : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = expired ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = expired ? 0 : Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired };
};

// export const SetItemToLocalStorage = (key, data) => {
//     localStorage.setItem(key, JSON.stringify(data));
// }

export const SetRefreshToken = (refreshToken) => {
  let date = new Date();
  date.setTime(date.getTime() + 400 * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + date.toUTCString();
  document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; ${expires}`;
};

export const SetAccessToken = (accessToken) => {
  let date = new Date();
  date.setTime(date.getTime() + 400 * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + date.toUTCString();
  document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict; ${expires}`;
};

export const RefreshToken = async () => {
  const refreshToken = GetRefreshToken();
  let isRefreshed;
  await PostRefreshToken(refreshToken)
    .then((resp) => {
      SetAccessToken(resp.data.access_token);
      isRefreshed = true;
    })
    .catch(() => {
      isRefreshed = false;
    });
  return isRefreshed;
};
// export const GetItemFromLocalStorage = (key) => {
//     return JSON.parse(localStorage.getItem(key));
// }

export const GetRefreshToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split('; refreshToken=');
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    if (token !== 'null') {
      return token;
    } else {
      return false;
    }
  }
  return false;
};

export const GetAccessToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split('; accessToken=');
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    if (token !== 'null') {
      return token;
    } else {
      return false;
    }
  }
  return false;
};

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const SetCategoryTitleToDocument = (title) => {
  document.title = title;
};

export const IsMobileBrowser = () => {
  const minResolution = useMedia('(max-width: 900px)');
  return isMobile || minResolution;
};

export const isLogedIn = () => {
  const refreshToken = GetRefreshToken();
  const accessToken = GetAccessToken();
  if (refreshToken && accessToken && refreshToken !== undefined && accessToken !== undefined) {
    return true;
  } else {
    return false;
  }
};

export const retry = async (caller, args = []) => {
  return await RefreshToken().then((resp) => {
    if (resp) {
      return caller(...args, true);
    } else {
      throw new Error('UNAUTHORIZED');
    }
  });
};

// export const getMe = async (retried = false) => {
//     const accessToken = GetAccessToken();
//     if (accessToken) {
//         return await GetMe(accessToken)
//             .then((resp) => {
//                 return resp.data;
//             })
//             .catch(async (error) => {
//                 if (error.response && error.response.status === 401) {
//                     if (!retried) {
//                         return await retry(getMe)
//                             .then((resp) => {
//                                 return resp;
//                             })
//                             .catch(() => {
//                                 throw new Error("UNAUTHORIZED");
//                             });
//                     } else {
//                         throw new Error("UNAUTHORIZED");
//                     }
//                 } else if (error.response) {
//                     throw new Error(error.response.data.message);
//                 } else {
//                     return false;
//                 }
//             });
//     } else {
//         throw new Error("UNAUTHORIZED");
//     }
// }

export const postSignin = async (username, password) => {
  return await PostSignIn(username, password)
    .then((resp) => {
      return resp.data;
    })
    .catch(async (error) => {
      if (error.response && error.response.data.message === 'ATTEMPTS_EXCEEDED') {
        throw new Error('ATTEMPTS_EXCEEDED');
      } else if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        return false;
      }
    });
};

export const getCategories = async (retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await GetCategories(accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(getCategories)
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const getSubject = async (id, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await GetSubject(id, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(getSubject(id))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const getLecturer = async (id, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await GetLecturer(id, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(getLecturer(id))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const postLecturer = async (id, text, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await PostLecuter(id, text, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(postLecturer(id, text))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const postSubject = async (id, text, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await PostSubject(id, text, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(postSubject(id, text))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const postFile = async (id, file, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await PostFile(id, file, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(postFile(id, file))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const getFile = async (subjectId, fileId, retried = false, axiosConfig = {}) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await GetFile(subjectId, fileId, accessToken, axiosConfig)
      .then((resp) => {
        return resp;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(() => getFile(subjectId, fileId, true, axiosConfig))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const getFeed = async (offset, limit, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await GetFeed(offset, limit, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(getFeed(offset, limit))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const postFeed = async (content, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await PostFeed(content, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(postFeed(content))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};

export const postFeedComment = async (id, content, retried = false) => {
  const accessToken = GetAccessToken();
  if (accessToken) {
    return await PostFeedComment(id, content, accessToken)
      .then((resp) => {
        return resp.data;
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          if (!retried) {
            return await retry(postFeedComment(id, content))
              .then((resp) => {
                return resp;
              })
              .catch(() => {
                throw new Error('UNAUTHORIZED');
              });
          } else {
            throw new Error('UNAUTHORIZED');
          }
        } else if (error.response) {
          throw new Error(error.response.data.message);
        } else {
          return false;
        }
      });
  } else {
    throw new Error('UNAUTHORIZED');
  }
};
