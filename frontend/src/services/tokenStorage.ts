import { TOKEN_TYPE } from '@/constants/auth';

const { ACCESS_TOKEN, REFRESH_TOKEN } = TOKEN_TYPE;

const isBrowser = typeof window !== "undefined"

export const tokenStorage = {
  getAccessToken() {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN);
  },

  getRefreshToken() {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN);
  },

  setAccessToken(token: string) {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_TOKEN, token);
  },

  setRefreshToken(token: string) {
    if (!isBrowser) return;
    localStorage.setItem(REFRESH_TOKEN, token);
  },

  removeAccessToken() {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN);
  },

  removeRefreshToken() {
    if (!isBrowser) return;
    localStorage.removeItem(REFRESH_TOKEN);
  },

  clear() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },
};
