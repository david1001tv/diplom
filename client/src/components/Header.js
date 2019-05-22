import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Api from '../Api';
import {inject, observer} from "mobx-react";
import ALink from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import {Link} from 'react-router-dom';
import Search from "./Search";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  exitIcon: {
    color: '#ffffff'
  },
  accountIcon: {
    marginLeft: 20,
    color: '#ffffff'
  },
  link: {
    color: "#ffffff"
  },
  button: {
    marginLeft: 20,
  },
  search: {
    marginLeft: 'auto',
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const {isLogged} = this.props.AppStore;

    return <AppBar className={classes.appBar}>
      <Toolbar>
        <ALink href={'/'} className={classes.link}>
          Cool service
        </ALink>
        <Search className={classes.search} {...{value:''}}/>
        {
          isLogged ?
            <React.Fragment>
            <IconButton className={classes.accountIcon} component={Link} to='/profile'>
              <AccountCircle />
            </IconButton>
            <IconButton className={classes.exitIcon} onClick={() => Api.logOut()}>
              <ExitToApp />
            </IconButton>
            </React.Fragment>
            :
            <Button className={classes.button} variant='contained' component={Link} to='/login'>LogIn</Button>
        }
      </Toolbar>
    </AppBar>
  }
}

export default withStyles(styles)(inject('AppStore')(observer((Header))));