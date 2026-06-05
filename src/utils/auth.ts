export const TOKEN_KEY = 'x-token';

type JwtPayload = {
  ID?: number;
  id?: number;
  Username?: string;
  username?: string;
  Mobile?: string;
  mobile?: string;
  exp?: number;
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function parseJwt(token: string): JwtPayload {
  if (!token) return {};
  const [, payload] = token.split('.');
  if (!payload) return {};
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(decoded);
  } catch (error) {
    return {};
  }
}

export function getUserIdFromToken() {
  const payload = parseJwt(getToken());
  return payload.ID || payload.id;
}

export function isTokenExpired() {
  const payload = parseJwt(getToken());
  if (!payload.exp) return false;
  return payload.exp * 1000 <= Date.now();
}
