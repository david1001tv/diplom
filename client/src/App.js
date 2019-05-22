import React, {Component} from 'react';
import {Provider} from 'mobx-react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Routes from './Routes';
import blue from '@material-ui/core/colors/blue';

import ApplicationStore from './stores/AppStore';
import UsersStore from "./stores/UsersStore";

const theme = createMuiTheme({
  palette: {
    type: 'light',
    main: blue[900],
  },

  typography: {
    useNextVariants: true,
  },
});

window.theme = theme;

const AppStore = new ApplicationStore();

const stores = {
  AppStore,
  UsersStore: new UsersStore()
};

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider {...stores}>
          <Routes/>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
