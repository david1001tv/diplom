import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Api from "../Api";
import MainTable from "../components/MainTable";
import Header from "../components/Header";


const styles = theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: 'auto'
  },
  mainTable: {
    margin: '0 100px'
  },
  paper: {
    width: 1400,
    marginTop: 150,
    marginBottom: 100
  },
  header: {
    paddingTop: 50
  },
  text: {
    padding: '50px 100px 0 100px',
    fontSize: 20,
    fontFamily: 'Pangolin'
  }
});

class LandingContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    params: this.props.AppStore.globalParams || [],
    height: 1500
  };

  loadData = (params) => {
    let requestParams = '?';
    params.forEach(param => {
      let key = Object.keys(param)[0];
      let value = param[Object.keys(param)[0]];
      requestParams += (key + '=' + value + '&');
    });
    Api.get('conferences' + requestParams).then(res => {
      this.setState({
        height: 270 + (res.total === 0 ? 230 : res.total * 220)
      })
    });
    return Api.get('conferences' + requestParams);
  };

  onSubmit = (params) => {
    this.setState({
      params: params
    });
  };

  handleClear = () => {
    this.setState({
      params: [
        {query: ''}
      ]
    });
  };

  render() {
    const {classes} = this.props;

    return <React.Fragment>
      <Header
        onSubmit={this.onSubmit}
        handleClear={this.handleClear}
        isSearch={true}
      />
      <Grid container className={classes.mainGrid} justify="center">
        <Grid key={0} item>
          <Paper className={classes.paper} style={{height:this.state.height}}>
            <Typography className={classes.header} variant="h3" component="h3" align="center">
              Welcome to COOL CONFA!
            </Typography>
            <Typography className={classes.text} align="center">
              Hello! You have come to the coolest portal with conferences in our country. On our portal you can get
              acquainted with the list of all the nearest conferences, see all the prepared talks and see all the
              speakers.
            </Typography>
            <MainTable
              clasess={classes}
              loadData={this.loadData}
              params={this.state.params}
            />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore')(observer(LandingContainer)));
