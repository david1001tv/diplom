import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UsersTable from '../components/UsersTable';
import ConferencesTable from '../components/ConferencesTable';
import SpeakersTable from '../components/SpeakersTable';
import TalksTable from '../components/TalksTable';
import {parseJwt} from "../helpers/parseJWT";
import Api from "../Api";
import Typography from "@material-ui/core/Typography";
import Warning from "@material-ui/icons/Warning";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const styles = theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },

  section: {
    ...theme.mixins.gutters(),
    backgroundColor: 'grey'
  },

  root: {
    marginTop: '25vh',
    textAlign: 'center'
  },
  icon: {
    fontSize: '6rem'
  }
});

class AdminContainer extends Component {

  render() {
    const {classes} = this.props;
    const {activeTab, changeTab} = this.props.AdminContainersStore;
    const payload = parseJwt(Api.token);

    return <React.Fragment>
      {
        payload.isAdmin ?
          <section className={classes.section}>
            <Grid container spacing={0}>
              <Grid item sm={6}>
                <AppBar
                  position='static'
                  classes={{
                    root: classes.appBar
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={(e, tabIndex) => changeTab(tabIndex)}
                  >
                    <Tab label="Users"/>
                    <Tab label="Conferences"/>
                    <Tab label="Speakers"/>
                    <Tab label="Talks"/>
                  </Tabs>

                </AppBar>
              </Grid>

              {activeTab === 0 && <UsersTable/>}
              {activeTab === 1 && <ConferencesTable/>}
              {activeTab === 2 && <SpeakersTable/>}
              {activeTab === 3 && <TalksTable/>}

            </Grid>

          </section> : <div className={classes.root}>
            <Typography>
              <Warning className={classes.icon} color='error'/>
            </Typography>
            <Typography variant='h5' gutterBottom>
              You have no admin access, please leave this page
            </Typography>
            <Button variant='contained' component={Link} to='/'>
              To the main page
            </Button>
          </div>
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AdminContainersStore', 'UsersStore')(observer(AdminContainer)));
