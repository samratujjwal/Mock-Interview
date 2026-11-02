import api from '../services/api';

export function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function clearAuthHeader() {
  delete api.defaults.headers.common.Authorization;
}
