import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UsersTable from '../components/UsersTable';
import ConferencesTable from '../components/ConferencesTable';
import SpeakersTable from '../components/SpeakersTable';
// import TalksTable from '../components/TalksTable';

const styles = theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },

  section: {
    ...theme.mixins.gutters(),
    backgroundColor: 'grey'
  },

});

class AdminContainer extends Component {

  render() {
    const { classes } = this.props;
    const { activeTab, changeTab } = this.props.AdminContainersStore;

    return <section className={classes.section}>
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
              <Tab label="Users" />
              <Tab label="Conferences" />
              <Tab label="Speakers" />
              <Tab label="Talks" />
            </Tabs>

          </AppBar>
        </Grid>

        {activeTab === 0 && <UsersTable />}
        {activeTab === 1 && <ConferencesTable />}
        {activeTab === 2 && <SpeakersTable />}
        {/*{activeTab === 3 && <TalksTable />}*/}

      </Grid>

    </section>
  }
}

export default withStyles(styles)(inject('AdminContainersStore', 'UsersStore')(observer(AdminContainer)));
