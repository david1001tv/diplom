import React, {Component} from 'react';
import clsx from 'clsx';
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
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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
    marginLeft: 30,
  },
  buttonReg: {
    marginLeft: 20,
    '@media (max-width: 1024px)': {
      marginLeft: '2%',
      fontSize: 10
    }
  },
  buttonLogin: {
    marginLeft: 10,
    '@media (max-width: 1024px)': {
      marginLeft: '2%',
      fontSize: 10
    }
  },
  search: {
    marginLeft: 'auto'
  },
  menuButton: {
    justifyContent: 'end',
    paddingRight: '3%'
  },
  menuLink: {
    fontSize: 20
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    query: this.props.AppStore.globalQuery || '',
    open: false
  };

  changeQuery = query => {
    this.setState({query});
  };

  handleDrawerOpen = () => {
    this.setState({
      open: !this.state.open
    })
  };

  handleDrawerClose = () => {
    this.setState({
      open: false
    })
  };

  render() {
    const {classes, onSubmit, handleClear, isSearch} = this.props;
    const {open} = this.state;
    const {isLogged} = this.props.AppStore;
    const payload = parseJwt(Api.token);
    console.log(window.innerWidth);

    return <AppBar className={classes.appBar}>
      {window.innerWidth > 1024 ? <Toolbar>
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
                <IconButton className={classes.accountIcon} style={{marginLeft: isSearch ? 20 : 'auto'}} component={Link}
                            to='/profile'>
                  <AccountCircle/>
                </IconButton>
                <IconButton className={classes.exitIcon} onClick={() => Api.logOut()}>
                  <ExitToApp/>
                </IconButton>
              </React.Fragment>
              :
              <React.Fragment>
                <Button className={classes.buttonReg} style={{marginLeft: isSearch ? 20 : 'auto'}} variant='contained'
                        component={Link}
                        to='/register'>Register</Button>
                <Button className={classes.buttonLogin} variant='contained' component={Link} to='/login'>LogIn</Button>
              </React.Fragment>
          }
        </Toolbar> :
        <React.Fragment>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            {
              isSearch && <Search className={classes.search}
                                  value={this.state.query}
                                  onChange={this.changeQuery}
                                  onSubmit={onSubmit}
                                  handleClear={handleClear}
              />
            }
            <MenuIcon
              onClick={this.handleDrawerOpen}
            />
          </IconButton>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon/>
              </IconButton>
            </div>
            <Divider/>
            <List>
              <ListItem button key={0}>
                <ALink href={'/'} className={classes.menuLink}>
                  Cool Confa
                </ALink>
              </ListItem>
              <ListItem button key={1}>
                <ALink href={'/talks'} className={classes.menuLink}>
                  Our Talks
                </ALink>
              </ListItem>
              <ListItem button key={2}>
                <ALink href={'/speakers'} className={classes.menuLink}>
                  Our Speakers
                </ALink>
              </ListItem>
              {
                payload.isAdmin && <ListItem button key={3}>
                  <ALink href={'/admin'} className={classes.menuLink}>
                    Admin Panel
                  </ALink>
                </ListItem>
              }
              {
                isLogged ?
                  <React.Fragment>
                    <IconButton className={classes.accountIcon} style={{marginLeft: isSearch ? 20 : 'auto', color: '#000'}} component={Link}
                                to='/profile'>
                      <AccountCircle/>
                    </IconButton>
                    <IconButton className={classes.exitIcon} onClick={() => Api.logOut()}>
                      <ExitToApp style={{color: '#000'}}/>
                    </IconButton>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Button className={classes.buttonReg} style={{marginLeft: isSearch ? 20 : 'auto'}} variant='contained'
                            component={Link}
                            to='/register'>Register</Button>
                    <Button className={classes.buttonLogin} variant='contained' component={Link} to='/login'>LogIn</Button>
                  </React.Fragment>
              }
            </List>
          </Drawer>
        </React.Fragment>
      }
    </AppBar>
  }
}

export default withStyles(styles)(inject('AppStore')(observer((Header))));
