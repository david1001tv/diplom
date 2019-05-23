import React, {Component} from 'react';
import {Provider} from 'mobx-react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Routes from './Routes';
import blue from '@material-ui/core/colors/blue';
import red from "@material-ui/core/colors/red";

import ApplicationStore from './stores/AppStore';
import UsersStore from "./stores/UsersStore";
import AdminContainersStore from './stores/AdminContainersStore';
import TableStore from './stores/TableStore';

const theme = createMuiTheme({
  palette: {
    // type: 'light',
    // main: blue[900],
    primary: {
      main: blue[900],
    },
    secondary: {
      main: red[900],
    },
    background: {
      default: "grey"
    }
  },

  typography: {
    useNextVariants: true,
  },
});

window.theme = theme;

const AppStore = new ApplicationStore();

const stores = {
  AppStore,
  UsersStore: new UsersStore(),
  AdminContainersStore: new AdminContainersStore(AppStore),
  ConferencesStore: new TableStore('admin/conferences', AppStore),
  SpeakersStore: new TableStore('admin/speakers', AppStore),
  TalksStore: new TableStore('admin/talks', AppStore),
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
