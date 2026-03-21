import { TOKEN_TYPE } from '@/constants/auth';

const { ACCESS_TOKEN, REFRESH_TOKEN } = TOKEN_TYPE;

export const tokenStorage = {
  getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN);
  },

  getRefreshToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN);
  },

  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN, token);
  },

  setRefreshToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN, token);
  },

  removeAccessToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN);
  },

  removeRefreshToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN);
  },

  clear() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },
};
