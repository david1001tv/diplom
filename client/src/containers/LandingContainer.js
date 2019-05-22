import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Api from "../Api";
import MainTable from "../components/MainTable";


const styles = theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: 'auto'
  },
  mainTable: {
    margin: '0 100px'
  },
  paper: {
    height: 1500,
    width: 1400,
    marginTop: 150,
    marginBottom: 100
  },
  header: {
    paddingTop: 50
  }
});

class LandingContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  loadData(params = []) {
    let requestParams = '?';
    params.forEach(param => {
      let key = Object.keys(param)[0];
      let value = param[Object.keys(param)[0]];
      requestParams += (key + '=' + value + '&');
    });
    return Api.get('conferences' + requestParams);
  }

  render() {
    const {classes} = this.props;

    return <Grid container className={classes.mainGrid} justify="center">
      <Grid key={0} item>
        <Paper className={classes.paper}>
          <Typography className={classes.header} variant="h3" component="h3" align="center">
            Welcome to my HELL!
          </Typography>
          <MainTable
            clasess={classes}
            loadData={this.loadData}
          />
        </Paper>
      </Grid>
    </Grid>
  }
}

export default withStyles(styles)(inject('AppStore')(observer(LandingContainer)));
