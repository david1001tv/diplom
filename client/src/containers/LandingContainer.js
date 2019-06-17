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
    margin: 'auto',
    width: '100%'
  },
  insideGrid: {
    width: '100%'
  },
  mainTable: {
    margin: '0 10%'
  },
  paper: {
    width: '70%',
    marginTop: 150,
    marginBottom: 100,
    marginLeft: '15%',
    paddingBottom: 1,
    '@media (max-width: 1024px)': {
      width: '95%',
      marginLeft: '2.5%',
    }
  },
  header: {
    paddingTop: 50,
    '@media (max-width: 1024px)': {
      fontSize: 30
    }
  },
  text: {
    padding: '50px 10% 0 10%',
    fontSize: 20,
    fontFamily: 'Pangolin',
    width: '100%',
    '@media (max-width: 1024px)': {
      fontSize: 15
    }
  }
});

class LandingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      perPage: 4,
      page: 1,
      pageCount: 1
    };

    this.dataLengthLimit = props.dataLengthLimit;
    this.defaultHeight = props.defaultHeight;
    this.componentHeight = props.componentHeight;
  }

  componentDidMount() {
    let {content} = this.props;
    let requestParams = this.makeParamsString([
      {limit: this.state.perPage},
      {page: this.state.page}
    ]);
    this.loadData(content, requestParams);
  }

  loadData = (url, params = '') => {
    Api.get(`${url}?${params}`).then(res => {
      let length = url !== 'conferences' ? Math.ceil(res.data.length / 2) : res.data.length;
      this.setState({
        data: res.data,
        pageCount: Math.ceil(res.total / this.state.perPage)
      });
    });
  }

  handlePageClick = data => {
    let selected = data.selected;
    let {content} = this.props;

    this.setState({page: selected + 1}, () => {
      let requestParams = this.makeParamsString([
        {limit: this.state.perPage},
        {page: this.state.page}
      ]);
      this.loadData(content, requestParams);
    });
  };

  makeParamsString = (params = []) => {
    let requestParams = '';
    params.forEach(param => {
      let key = Object.keys(param)[0];
      let value = param[Object.keys(param)[0]];
      requestParams += (key + '=' + value + '&');
    });
    return requestParams;
  };

  onSubmit = (params) => {
    let {content} = this.props;
    let requestParams = this.makeParamsString(params);
    this.loadData(content, requestParams);
  };

  handleClear = () => {
    let {content} = this.props;
    this.loadData(content);
  };

  render() {
    const {classes, content, text} = this.props;

    return <React.Fragment>
      <Header
        onSubmit={this.onSubmit}
        handleClear={this.handleClear}
        isSearch={true}
      />
      <Grid container className={classes.mainGrid} justify="center">
        <Grid className={classes.insideGrid}>
          <Paper className={classes.paper}>
            {
              !text ? <React.Fragment>
                <Typography className={classes.header} variant="h3" component="h3" align="center">
                  Welcome to COOL CONFA!
                </Typography>
                <Typography className={classes.text} align="center">
                  Hello! You have come to the coolest portal with conferences in our country. On our portal you can get
                  acquainted with the list of all the nearest conferences, see all the prepared talks and see all the
                  speakers.
                </Typography>
              </React.Fragment> : <React.Fragment>
                <Typography className={classes.header} variant="h3" component="h3" align="center">
                  {text}
                </Typography>
              </React.Fragment>
            }
            <MainTable
              clasess={classes}
              data={this.state.data}
              content={content}
              handlePageClick={this.handlePageClick}
              pageCount={this.state.pageCount}
            />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore')(observer(LandingContainer)));
