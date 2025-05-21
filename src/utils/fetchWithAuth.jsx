import { getCookieValue } from "../App";

const fetchWithAuth = (url, options = {}) => {
  const token = getCookieValue("auth_token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

export default fetchWithAuth;
