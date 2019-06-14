import {
  parseJwt
} from './helpers/parseJWT';

const API_URL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_API_PORT}/api/`;

export default class API {

  constructor() {
    throw new Error('Cannot create instance');
  }

  static token = localStorage.getItem('token') || '';

  static isRefreshing = null;

  static isRefreshingNeed(endpoint) {
    return (parseJwt(this.token).exp < Date.now() / 1000 - 5 && endpoint !== 'auth/refresh')
  }

  static isTokenExpired(payload = {}) {
    return !payload.exp || Date.now() > payload.exp * 1000;
  }

  static shouldRefreshToken(err) {
    return err.status === 401 &&
      err.message === 'jwt expired'
  }

  static _refreshPromise = null;

  static refreshToken() {
    if (this._refreshPromise) {
      return this._refreshPromise
    }

    this._refreshPromise = this._request(`auth/refresh`, 'POST', JSON.stringify({
      token: this.token
    })).then(res => {
      localStorage.setItem('token', res.token);
      this.token = res.token;
      this._refreshPromise = null;
    })
      .catch(() => {
        localStorage.removeItem('token');
        window.location = window.origin + '/login'
      });

    return this._refreshPromise
  }

  static async _request(endpoint, method, body = null) {
    let fetchRes = {};

    if (this.isRefreshingNeed(endpoint)) {
      await this.refreshToken();
    }

    return fetch(`${API_URL}${endpoint}`, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token //Bearer
      }
    }).then(res => {
      fetchRes = res;
      return res.json()
    }).then(data => {
      if (fetchRes.status === 401) {
        if (data.message === 'jwt expired') {
          return this.refreshToken()
            .then(() => this._request(endpoint, method, body))
        }
      } else {
        if (!fetchRes.ok) throw data;
        return data;
      }
    })
  }

  static get(url) {
    return this._request(url, 'GET')
  }

  static post(url, data) {
    return this._request(url, 'POST', data)
  }

  static put(url, data) {
    return this._request(url, 'PUT', data)
  }

  static patch(url, data) {
    return this._request(url, 'PATCH', data)
  }

  static delete(url, data) {
    return this._request(url, 'DELETE', data)
  }

  static logIn(login, password) {

    return this.post('auth/login', JSON.stringify({
      login,
      password
    })).then(res => {
      const {
        token
      } = res;
      localStorage.setItem('token', token);
      return this.token = token;
    })
  }

  static logOut() {
    const token = localStorage.getItem('token');

    return this.post('auth/logout', JSON.stringify({
      token
    })).then(res => {
      localStorage.removeItem('token');
      return this.token = '';
    })
      .finally(() => window.location = window.origin + '/login')
  }

}
