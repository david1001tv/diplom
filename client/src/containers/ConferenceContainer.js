import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Api from "../Api";
import Header from "../components/Header";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Face from '@material-ui/icons/Face';
import {Redirect} from 'react-router-dom';
import IconButton from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import {parseJwt} from "../helpers/parseJWT";

const styles = theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: 'auto'
  },
  paper: {
    width: 1400,
    marginTop: 150,
    marginBottom: 100
  },
  title: {
    paddingTop: 50,
    fontSize: 35,
    fontFamily: 'Pangolin'
  },
  date: {
    fontSize: 17,
    float: 'left',
    paddingLeft: '100px'
  },
  address: {
    fontSize: 17,
    float: 'left',
    paddingLeft: '20px'
  },
  textCard: {
    fontSize: 16,
    paddingLeft: 20,
    paddingTop: 15
  },
  from: {
    fontSize: 14,
    padding: '0 10px'
  },
  talkCard: {
    height: 310,
    width: 550,
    marginTop: 50,
    marginLeft: 100,
    display: 'inline-block'
  },
  talkName: {
    fontSize: 28,
    fontFamily: 'Pangolin'
  },
  speaker: {
    fontSize: 20,
    paddingLeft: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    fontSize: 50,
    paddingRight: 10
  },
  text: {
    padding: '50px 100px 0 100px',
    fontSize: 20,
    fontFamily: 'Pangolin'
  },
  git: {
    fontSize: 16,
    color: '#453434',
  },
  rightIcon: {
    marginLeft: 5
  },
  iconSmall: {
    fontSize: 20,
  },
  button: {
    paddingRight: 100,
    paddingTop: 50
  }
});

class ConferenceContainer extends Component {
  constructor(props) {
    super(props)
    this.id = this.props.match.params.id;
  }

  state = {
    height: 1500,
    data: {},
    isVisited: false
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

  componentDidMount() {
    const payload = parseJwt(Api.token);
    Api.get('conferences/' + this.id).then(res => {
      let count = Math.ceil((res.talks.length + res.speakers.length) / 2);
      this.setState({
        data: res,
        height: count > 0 ? (count > 1 ? (count * 400) + 250 : 750) : 520
      })
    });
    Api.get('user-confs?filter[user][]=' + payload.id).then(res => {
      let isVisit = res.data.find(el => {
        return el.conference._id === this.id
      });
      this.setState({
        isVisited: !!isVisit
      })
    })
  }

  loadData = () => {
    return Api.get('conferences/' + +this.id);
  };

  visitHandler = e => {
    Api.post('user-confs', JSON.stringify({
      conference: this.id
    })).then(res => {
      this.setState({
        isVisited: !this.state.isVisited
      })
    })
  };

  onSubmit = (params) => {
    Api.get('conferences/' + this.id + '?query=' + params[0].query).then(res => {
      let count = Math.ceil((res.talks.length + res.speakers.length) / 2);
      console.log(count)
      this.setState({
        data: res,
        height: count > 0 ? (count > 1 ? (count * 400) + 300 : 750) : 520
      })
    })
  };

  handleClear = () => {
    Api.get('conferences/' + this.id).then(res => {
      let count = Math.ceil((res.talks.length + res.speakers.length) / 2);
      this.setState({
        data: res,
        height: count > 0 ? (count > 1 ? (count * 400) + 250 : 750) : 520
      })
    })
  };

  render() {
    const {classes} = this.props;
    const {isLogged} = this.props.AppStore;

    return <React.Fragment>
      <Header
        onSubmit={this.onSubmit}
        handleClear={this.handleClear}
        isSearch={true}
      />
      {
        Object.keys(this.state.data).length ?
          <Grid container className={classes.mainGrid} justify="center">
            <Grid key={0} item>
              <Paper className={classes.paper} style={{height: this.state.height}}>
                <Typography className={classes.title} align={"center"}>
                  {this.state.data.conference.name}
                </Typography>
                <Typography className={classes.date} align={"center"}>
                  {this.formatDate(new Date(Date.parse(this.state.data.conference.date)))}
                </Typography>
                {
                  this.state.data.conference.city ?
                    <Typography className={classes.address} align={"center"}>
                      in {this.state.data.conference.city.name}
                    </Typography> :
                    null
                }
                <Typography className={classes.address} align={"center"}>
                  at {this.state.data.conference.address}
                </Typography>
                <Typography className={classes.text} align={"justify"}>
                  {this.state.data.conference.description}
                </Typography>
                {
                  this.state.data.talks && this.state.data.talks.length !== 0 ? this.state.data.talks.map((talk, index) => {
                    return <Card key={index} className={classes.talkCard}>
                      <CardContent>
                        <Typography className={classes.talkName} align={"center"}>
                          {talk.name}
                        </Typography>
                        <Typography className={classes.speaker} align={"left"}>
                          <Face className={classes.icon}/> {talk.speaker.first_name + ' ' + talk.speaker.last_name}
                          <span
                            className={classes.from}>from</span> {talk.speaker.country.country_name}
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          <span className={classes.git}>GitHub</span>: <a
                          href={talk.speaker.github}>{talk.speaker.github}</a>
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          {talk.info}
                        </Typography>
                      </CardContent>
                    </Card>
                  }) : <Typography className={classes.text} align={"center"}>
                    Sorry... We have no information about talks :(
                  </Typography>
                }
                {
                  this.state.data.speakers && this.state.data.speakers.length !== 0 ? this.state.data.speakers.map((speaker, index) => {
                    return <Card key={index} className={classes.talkCard}>
                      <CardContent>
                        <Typography className={classes.talkName} align={"center"}>
                          Speaker {index + 1}
                        </Typography>
                        <Typography className={classes.speaker} align={"left"}>
                          <Face className={classes.icon}/> {speaker.first_name + ' ' + speaker.last_name} <span
                          className={classes.from}>from</span> {speaker.country.country_name}
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          <span className={classes.git}>GitHub</span>: <a
                          href={speaker.github}>{speaker.github}</a>
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          {speaker.interests}
                        </Typography>
                      </CardContent>
                    </Card>
                  }) : <Typography className={classes.text} align={"center"}>
                    Sorry... We have no information about speakers :(
                  </Typography>
                }
                {
                  isLogged ? <Typography align={"right"} className={classes.button}>
                    <IconButton id='visit' ref='visit' variant="contained" color="primary" onClick={this.visitHandler}>
                      Want to visit
                      {
                        this.state.isVisited ? <CheckIcon className={classes.rightIcon}>-</CheckIcon> : <AddIcon className={classes.rightIcon}>+</AddIcon>
                      }
                    </IconButton>
                  </Typography> : null
                }
              </Paper>
            </Grid>
          </Grid> :
          null
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore', 'ConferencesStore')(observer(ConferenceContainer)));
