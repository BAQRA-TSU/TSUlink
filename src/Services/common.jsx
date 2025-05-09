import { isMobile } from "react-device-detect";
import { useMedia } from "use-media";
import { DeleteActivity, DeleteCard, GetAccountLogins, GetCards, GetLoyalty, GetLoyaltyTransactions, GetMe, GetNotifications, GetOneNotification, GetOneTransaction, GetTransactions, GetWallet, PatchNotifications, PatchPhoneUpdateCheck, PatchUser, PostActivity, GetGameUrl, PostImage, PostImageSubmit, PostPasswordUpdateCheck, PostRefreshToken, PostSendPasswordUpdateCode, PostSendPaymentCode, PostSendPhoneUpdateCode, PostSignIn, PostVeriffSesion, PostWallet } from "./service";

let ssoUrl = import.meta.env.VITE_APP_SSO_URL
let paymentUrl = import.meta.env.VITE_APP_PAYMENT_URL
let webApiUrl = import.meta.env.VITE_APP_WEBAPI_URL
let veriffUrl = import.meta.env.VITE_APP_VERIFF_URL
let sseUrl = import.meta.env.VITE_APP_SSE_URL


// const locale = {};

export const GetPaymentUrl = () => {
    return paymentUrl;
};

export const GetWebApiUrl = () => {
    return webApiUrl;
};

export const GetVeriffUrl = () => {
    return veriffUrl;
};

export const GetSsoUrl = () => {
    return ssoUrl;
};

export const GetSseUrl = () => {
    return sseUrl;
};

// export const GetStaticContentBaseUrl = () => {
//     return staticContentUrl;
// };

export const IsLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
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
    let hours = expired
        ? 0
        : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = expired
        ? 0
        : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = expired ? 0 : Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired };
};

// export const SetItemToLocalStorage = (key, data) => {
//     localStorage.setItem(key, JSON.stringify(data));
// }

export const SetRefreshToken = (refreshToken) => {
    let date = new Date();
    date.setTime(date.getTime() + (400 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; ${expires}`;
};

export const SetAccessToken = (accessToken) => {
    let date = new Date();
    date.setTime(date.getTime() + (400 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
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
    const parts = value.split("; refreshToken=");
    if (parts.length === 2) {
        const token = parts.pop().split(";").shift();
        if (token !== "null") {
            return token;
        } else {
            return false;
        }
    }
    return false;
};

export const GetAccessToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split("; accessToken=");
    if (parts.length === 2) {
        const token = parts.pop().split(";").shift();
        if (token !== "null") {
            return token;
        } else {
            return false;
        }
    }
    return false;
};

function jwtDecode(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join("")
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
    const minResolution = useMedia("(max-width: 900px)");
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
    return await RefreshToken()
        .then((resp) => {
            if (resp) {
                return caller(...args, true);
            } else {
                throw new Error("UNAUTHORIZED");
            }
        });
}

export const getCard = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetCards(accessToken)
            .then((data) => {
                return { cards: data.data }
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getCard)
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
};

export const addToActivity = async (id, type, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostActivity(accessToken, type, id)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(addToActivity, [id, type])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const removeFromActivity = async (id, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await DeleteActivity(accessToken, id)
            .then(() => {
                return true
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(removeFromActivity, [id])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}


export const getMe = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetMe(accessToken)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(getMe)
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const openGame = async (gameUid, openMode, setGameLink, tries = 0) => {
    if (!isLogedIn()) {
        return false;
    }
    let response = "pending";
    const accessToken = GetAccessToken();
    if (accessToken) {
        await GetGameUrl(accessToken, gameUid)
            .then((resp) => {
                if (resp) {
                    response = resp.data;
                }
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 400) {
                    response = "blocked";
                }
                if (error.response && error.response.status === 403) {
                    await RefreshToken().then((resp) => {
                        if (!resp) {
                            response = false;
                        } else {
                            if (tries < 2) {
                                openGame(gameUid, openMode, setGameLink, tries);
                            } else {
                                response = false;
                            }
                        }
                    });
                }
            });
    } else {
        response = false;
    }

    if (response && response !== 'pending') {
        addToActivity(gameUid, "last_played");
        if (openMode === "") {
            setGameLink(response.url);
        } else {
            window.open(response.url, '_blank')
        }
    }
    return response;
}

export const postWallet = async (amount, type, processorName, cardId, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostWallet(accessToken, amount, type, processorName, cardId)
            .then((resp) => {
                return resp.data.orderId
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(postWallet, [amount, type, processorName, cardId])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.status === 405) {
                    throw new Error("BLOCKED");
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getWallet = async (currencySymbols, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetWallet(accessToken)
            .then((resp) => {
                return { ...resp.data, showBalance: true, currencySymbol: currencySymbols[resp.data.currency] };
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getWallet, [currencySymbols])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const deleteCard = async (id, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await DeleteCard(id, accessToken)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(deleteCard, [id])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const phoneUpdateCheck = async (phone, code, personalId, password, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PatchPhoneUpdateCheck(accessToken, phone, code, personalId, password)
            .then((resp) => {
                if (resp) {
                    return { phone: resp.data.phone };
                } else {
                    return false;
                }
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(phoneUpdateCheck, [phone, code, personalId, password])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.data.message === "OTP_CODE_NOT_VALID") {
                    throw new Error("OTP_CODE_NOT_VALID")
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            })
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const passwordUpdateCheck = async (currentPassword, newPassword, code, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostPasswordUpdateCheck(accessToken, currentPassword, newPassword, code)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(passwordUpdateCheck, [currentPassword, newPassword, code])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.data.message === "OTP_CODE_NOT_VALID") {
                    throw new Error("OTP_CODE_NOT_VALID");
                } else if (error.response && error.response.status === 401) {
                    throw new Error("NOT_CORRECT");
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            })
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const passwordUpdateSend = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostSendPasswordUpdateCode(accessToken)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(passwordUpdateSend, [])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                    throw new Error("ATTEMPTS_EXCEEDED");
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const phoneUpdateSend = async (phone, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostSendPhoneUpdateCode(accessToken, phone)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(phoneUpdateSend, [phone])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                    throw new Error("ATTEMPTS_EXCEEDED");
                } else if (error.response && error.response.data.message === "ACCOUNT_ALREADY_EXISTS") {
                    throw new Error("ACCOUNT_ALREADY_EXISTS");
                } else if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const addCardSend = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostSendPaymentCode(accessToken)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(addCardSend, [])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response && error.response.status === 405) {
                    throw new Error("BLOCKED")
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const editUserInfo = async (key, value, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PatchUser(accessToken, key, value)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(editUserInfo, [key, value])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const sendImage = async (sessionId, base64Image, docType, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostImage(accessToken, sessionId, base64Image, docType)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                console.log(error);
                //TODO axios error needs handling or fixing
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(sendImage, [sessionId, base64Image, docType])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error("image.upload.failed", { cause: error.response.data.message });
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const imageSubmit = async (sessionId, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostImageSubmit(accessToken, sessionId)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(imageSubmit, [sessionId])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}


export const getNotifications = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetNotifications(accessToken)
            .then((resp) => {
                return resp.data
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getNotifications, [])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const readNotifications = async (id, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PatchNotifications(accessToken, id)
            .then(() => {
                return true;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(readNotifications, [id])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const openOneNotification = async (id, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetOneNotification(accessToken, id)
            .then((resp) => {
                return resp;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(openOneNotification, [id])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getVeirffSesion = async (isReset, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await PostVeriffSesion(accessToken, isReset)
            .then((resp) => {
                return resp;
            })
            .catch(async (error) => {
                console.log(error);
                //TODO axios error needs handling or fixing
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getVeirffSesion, [isReset])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }

                } else if (error.response && error.response.status === 404) {
                    throw new Error("NO_SESSION")
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getTransactions = async (offset = 0, limit = 20, type, startDate, endDate, providers, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetTransactions(accessToken, offset, limit, type, startDate, endDate, providers)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getTransactions, [offset, limit, type, startDate, endDate, providers])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getOneTransaction = async (id, offset = 0, limit = 20, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetOneTransaction(accessToken, id, offset, limit,)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getOneTransaction, [id, offset, limit])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getAccountLogins = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetAccountLogins(accessToken)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 401) {
                    if (!retried) {
                        return await retry(getAccountLogins, [])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const postSignin = async (username, password) => {
    return await PostSignIn(username, password)
        .then((resp) => {
            return resp.data;
        })
        .catch(async (error) => {
            if (error.response && error.response.data.message === "OTP_CODE_NOT_VALID") {
                throw new Error("OTP_CODE_NOT_VALID");
            } else if (error.response && error.response.data.message === "ATTEMPTS_EXCEEDED") {
                throw new Error("ATTEMPTS_EXCEEDED");
            } else if (error.response) {
                throw new Error(error.response.data.message)
            } else {
                return false;
            }
        });
}

export const getLoyalty = async (retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetLoyalty(accessToken)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getLoyalty, [])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}

export const getLoyaltyTransactions = async (offset = 0, limit = 20, startDate, endDate, retried = false) => {
    const accessToken = GetAccessToken();
    if (accessToken) {
        return await GetLoyaltyTransactions(accessToken, offset, limit, startDate, endDate)
            .then((resp) => {
                return resp.data;
            })
            .catch(async (error) => {
                if (error.response && error.response.status === 403) {
                    if (!retried) {
                        return await retry(getLoyaltyTransactions, [offset, limit, startDate, endDate])
                            .then((resp) => {
                                return resp;
                            })
                            .catch(() => {
                                throw new Error("UNAUTHORIZED");
                            });
                    } else {
                        throw new Error("UNAUTHORIZED");
                    }
                } else if (error.response) {
                    throw new Error(error.response.data.message)
                } else {
                    return false;
                }
            });
    } else {
        throw new Error("UNAUTHORIZED");
    }
}