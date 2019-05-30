import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Api from "../Api";
import Header from "../components/Header";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  Redirect,
} from 'react-router-dom';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {parseJwt} from "../helpers/parseJWT";
import CardContent from "@material-ui/core/CardContent";
import ALink from "@material-ui/core/Link/Link";
import LongText from "../components/LongText";
import Card from "@material-ui/core/Card";

const styles = theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: 'auto',
  },
  mainTable: {
    margin: '0 100px'
  },
  paper: {
    width: 1000,
    height: 1000,
    marginTop: 150,
    marginBottom: 100,
  },
  header: {
    fontSize: 40,
    paddingTop: 50,
    fontFamily: '\'Stylish\', sans-serif'
  },
  formMe: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '\'Stylish\', sans-serif'
  },
  textField: {
    width: '40%',
    fontFamily: '\'Stylish\', sans-serif'
  },
  textArea: {
    width: '40%'
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    width: '40%',
    fontFamily: '\'Stylish\', sans-serif',
    fontSize: 20
  },
  myInfo: {
    padding: '0 300px',
    fontFamily: '\'Stylish\', sans-serif',
    fontSize: 25
  },
  conferenceContainer: {
    margin: '30px 100px'
  },
  date: {
    fontSize: '13px'
  },
  visitButton: {
    fontSize: '15px',
    backgroundColor: 'deepskyblue'
  },
  actions: {
    float: 'right',
  }
});

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    me: {},
    myConfs: [],
    errorMessage: ''
  };

  componentDidMount() {
    const payload = parseJwt(Api.token);
    Api.get('account').then(res => {
      this.setState({
        me: res.data
      })
    });
    Api.get('user-confs?filter[user][]=' + payload.id).then(res => {
      this.setState({
        myConfs: res.data
      })
    })
  }

  submitForm = e => {
    e.preventDefault();
    const {firstName, lastName, city, country, phone, interests} = this.formMe.elements;

    Api.put('account', JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      city: city.value,
      country: country.value,
      phone: phone.value,
      interests: interests.value
    })).then(res => {
      if (res.success) {
        this.setState({
          me: res.data
        })
      } else {
        this.setState({
          errorMessage: res.message
        })
      }
    }).catch(err => this.setState({errorMessage: err.message}))
  };

  formatDate = (date) => {
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  };

  submitResetPassword = e => {
    e.preventDefault();
    const {oldPassword, newPassword} = this.formPass.elements;

    Api.patch('account/password-reset', JSON.stringify({
      oldPwd: oldPassword.value,
      newPwd: newPassword.value
    })).then(res => {
      if (!res.success) {
        this.setState({
          errorMessage: res.message
        })
      }
    }).catch(err => this.setState({errorMessage: err.message}))
  };

  render() {
    const {classes} = this.props;
    const {errorMessage, me, myConfs} = this.state;
    const {isLogged} = this.props.AppStore;
    const {activeTab, changeTab} = this.props.ProfileStore;

    return <React.Fragment>
      {isLogged ? <React.Fragment>
        <Header
          onSubmit={this.onSubmit}
          handleClear={this.handleClear}
          isSearch={false}
        />
        <Grid container className={classes.mainGrid} justify="center">
          <Grid key={0} item>
            <Paper className={classes.paper}>
              <Tabs
                value={activeTab}
                onChange={(e, tabIndex) => changeTab(tabIndex)}
              >
                <Tab label="My Info"/>
                <Tab label="My Conferences"/>
              </Tabs>
              {
                activeTab === 0 && <React.Fragment>
                  <Typography className={classes.header} align={"center"}>
                    My info
                  </Typography>
                  {
                    me !== {} && me.attributes && <React.Fragment>
                        <Typography className={classes.myInfo} align={"left"}>
                          My Email: {me.email}
                        </Typography>
                        <form ref={node => this.formMe = node} onSubmit={this.submitForm} className={classes.formMe}>
                          {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
                          <TextField
                            id='firstName'
                            label='First Name'
                            className={classes.textField}
                            margin='normal'
                            defaultValue={me.attributes.first_name}
                          />

                          <TextField
                            id='lastName'
                            label='Last Name'
                            className={classes.textField}
                            margin='normal'
                            defaultValue={me.attributes.last_name}
                          />

                          <TextField
                            id='phone'
                            label='Phone'
                            className={classes.textField}
                            margin='normal'
                            defaultValue={me.attributes.phone}
                          />

                          <TextField
                            id='city'
                            label='City'
                            className={classes.textField}
                            margin='normal'
                            defaultValue={me.attributes.city}
                          />

                          <TextField
                            id='country'
                            label='Country'
                            className={classes.textField}
                            margin='normal'
                            defaultValue={me.attributes.country}
                          />

                          <TextField
                            id='interests'
                            label='Interests'
                            className={classes.textArea}
                            margin='normal'
                            defaultValue={me.attributes.interests}
                          />

                          <Button type='submit' variant='contained' color='primary' className={classes.button}>
                            Save
                          </Button>
                        </form>
                      </React.Fragment>
                  }
                  <React.Fragment>
                    <form ref={node => this.formPass = node} onSubmit={this.submitResetPassword}
                          className={classes.formMe}>
                      {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
                      <TextField
                        id='oldPassword'
                        label='Old Password'
                        type='password'
                        className={classes.textField}
                        margin='normal'
                      />
                      <TextField
                        id='newPassword'
                        label='New Password'
                        type='password'
                        className={classes.textField}
                        margin='normal'
                      />
                      <Button type='submit' variant='contained' color='primary' className={classes.button}>
                        Update password
                      </Button>
                    </form>
                  </React.Fragment>
                </React.Fragment>
              }
              {
                activeTab === 1 && <React.Fragment>
                  <Typography className={classes.header} align={"center"}>
                    My Conferences
                  </Typography>
                  {
                    myConfs.map((item, index) => {
                      return <Card key={index} className={classes.conferenceContainer}>
                        <CardContent>
                          <ALink className={classes.title} href={'/conferences/' + item.conference._id}>
                            {item.conference.name}
                          </ALink>
                          <Typography className={classes.date}>
                            {this.formatDate(new Date(Date.parse(item.conference.date)))} in {item.conference.city.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    })
                  }
                </React.Fragment>
              }
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment> : <Redirect to='/login'/>
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore', 'ProfileStore')(observer(ProfileContainer)));
