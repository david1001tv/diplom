import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 1000,
    width: 1400,
    marginTop: 150,
    marginBottom: 100
  },
});

class LandingContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {classes} = this.props;

    return <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid container className={classes.mainGrid} justify="center">
          <Grid key={0} item>
            <Paper className={classes.paper}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  }
}

export default withStyles(styles)(inject('AppStore')(observer(LandingContainer)));
