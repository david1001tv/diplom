import {
  decorate,
  observable,
  action,
  flow
} from 'mobx';
import Api from '../Api';

import {
  parseJwt
} from '../helpers/parseJWT';

class AppStore {
  constructor() {
    const payload = parseJwt(Api.token);

    this.isLogged = payload !== 'token is invalid';
    this.checkToken();
  }

  isSnackOpen = false;

  globalParams = null;

  globalQuery = '';

  snackMessage = '';

  username = '';

  handleOpenSnack = snackMessage => {
    this.snackMessage = snackMessage;
    this.isSnackOpen = true;
  };

  checkToken = flow(function* () {
    const payload = parseJwt(Api.token);
    if (payload !== 'token is invalid' && Api.isTokenExpired(payload)) {
      try {
        yield Api.refreshToken();
        this.isLogged = true;
      } catch (err) {
        this.isLogged = false;
      }
    } else {
      this.isLogged = !Api.isTokenExpired(payload);
    }
  });

  logIn = flow(function* (login, password) {
    try {
      yield Api.logIn(login, password);
      this.isLogged = true;
      return true;
    } catch (err) {
      this.isLogged = false;
      throw err;
    }

  });

  handleCloseSnack = () => this.isSnackOpen = false;
}

export default decorate(AppStore, {
  globalQuery: observable,
  globalParams: observable,
  isLogged: observable,
  isSnackOpen: observable,
  handleOpenSnack: action,
  handleCloseSnack: action
});
