import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
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
import {parseJwt} from "../helpers/parseJWT";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  exitIcon: {
    color: '#ffffff'
  },
  accountIcon: {
    color: '#ffffff'
  },
  link: {
    color: "#ffffff",
    '&:hover': {
      color: 'aqua'
    },
    marginLeft: 30
  },
  buttonReg: {
    marginLeft: 20,
  },
  buttonLogin: {
    marginLeft: 10
  },
  search: {
    marginLeft: 'auto',
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    query: this.props.AppStore.globalQuery || ''
  };

  changeQuery = query => {
    this.setState({query});
  };

  render() {
    const {classes, onSubmit, handleClear, isSearch} = this.props;
    const {isLogged} = this.props.AppStore;
    const payload = parseJwt(Api.token);

    return <AppBar className={classes.appBar}>
      <Toolbar>
        <ALink href={'/'} className={classes.link}>
          Cool Confa
        </ALink>
        <ALink href={'/talks'} className={classes.link}>
          Our Talks
        </ALink>
        <ALink href={'/speakers'} className={classes.link}>
          Our Speakers
        </ALink>
        {
          payload.isAdmin && <ALink href={'/admin'} className={classes.link}>
              Admin Panel
            </ALink>
        }
        {
          isSearch && <Search className={classes.search}
                  value={this.state.query}
                  onChange={this.changeQuery}
                  onSubmit={onSubmit}
                  handleClear={handleClear}
          />
        }
        {
          isLogged ?
            <React.Fragment>
              <IconButton className={classes.accountIcon} style={{marginLeft: isSearch ? 20 : 'auto'}} component={Link} to='/profile'>
                <AccountCircle/>
              </IconButton>
              <IconButton className={classes.exitIcon} onClick={() => Api.logOut()}>
                <ExitToApp/>
              </IconButton>
            </React.Fragment>
            :
            <React.Fragment>
              <Button className={classes.buttonReg} style={{marginLeft: isSearch ? 20 : 'auto'}} variant='contained' component={Link}
                      to='/register'>Register</Button>
              <Button className={classes.buttonLogin} variant='contained' component={Link} to='/login'>LogIn</Button>
            </React.Fragment>
        }
      </Toolbar>
    </AppBar>
  }
}

export default withStyles(styles)(inject('AppStore')(observer((Header))));
