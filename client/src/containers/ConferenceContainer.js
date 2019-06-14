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
import IconButton from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import {parseJwt} from "../helpers/parseJWT";

import jsPDF from 'jspdf';
import ArrowDownward from "@material-ui/icons/ArrowDownward";

const styles = theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: 'auto',
    width: '70%',
    marginLeft: '15%',
  },
  grid: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginTop: 150,
    marginBottom: 100,
    paddingBottom: 30
  },
  title: {
    paddingTop: 50,
    fontSize: 35,
    fontFamily: 'Pangolin'
  },
  date: {
    fontSize: 17,
    float: 'left',
    paddingLeft: '100px',
    '@media (max-width: 1024px)': {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
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
    width: '40%',
    marginTop: 50,
    marginLeft: '7%',
    display: 'inline-block',
    '@media (max-width: 1024px)': {
      width: '90%',
      marginLeft: '5%',
    }
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
    fontFamily: 'Pangolin',
    '@media (max-width: 1024px)': {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
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
    paddingRight: '5%',
    paddingTop: 50
  },
  controlBtn: {
    marginRight: 10
  }
});

class ConferenceContainer extends Component {
  constructor(props) {
    super(props)
    this.id = this.props.match.params.id;
  }

  state = {
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
      this.setState({
        data: res
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
      this.setState({
        data: res
      })
    })
  };

  handleClear = () => {
    Api.get('conferences/' + this.id).then(res => {
      this.setState({
        data: res
      })
    })
  };

  makeReport = () => {
    let str = 'Conference\n\n';
    str += ('Name: ' + this.state.data.conference.name) + '\n';
    str += ('Date: ' + this.formatDate(new Date(Date.parse(this.state.data.conference.date)))) + '\n';
    str += ('City: ' + this.state.data.conference.city.name) + '\n';
    str += ('Address: ' + this.state.data.conference.address) + '\n';
    str += ('Description: ' + this.state.data.conference.description) + '\n\n';

    str += 'Talks\n';
    this.state.data.talks.forEach((talk, index) => {
      str += '\n' + ('#' + index) + '\n';
      str += ('Name: ' + talk.name) + '\n';
      str += ('Info: ' + talk.info) + '\n';
      str += ('Speaker name: ' + talk.speaker.first_name + ' ' + talk.speaker.last_name) + '\n';
      str += ('Speaker GitHub: ' + talk.speaker.github) + '\n';
      str += ('Interests: ' + talk.speaker.interests) + '\n';
    });

    str += '\n\nVisitors\n';
    this.state.data.users.forEach((visitor, index) => {
      str += '\n' + ('#' + index) + '\n';
      str += ('Name: ' + visitor.attributes.first_name + ' ' + visitor.attributes.last_name) + '\n';
      str += ('Email: ' + visitor.email) + '\n';
      str += ('Interests: ' + visitor.attributes.interests) + '\n';
    });

    const doc = new jsPDF();

    doc.text(str, 10, 10);
    doc.save('conference_' + this.id + '.pdf');
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
        Object.keys(this.state.data).length &&
        <Grid container className={classes.mainGrid} justify="center">
          <Grid key={0} item className={classes.grid}>
            <Paper className={classes.paper}>
              <Typography className={classes.title} align={"center"}>
                {this.state.data.conference.name}
              </Typography>
              <Typography className={classes.date} align={"center"}>
                {this.formatDate(new Date(Date.parse(this.state.data.conference.date)))}
              </Typography>
              {
                this.state.data.conference.city && <Typography className={classes.address} align={"center"}>
                  in {this.state.data.conference.city.name}
                </Typography>
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
                isLogged && this.state.data.users && <React.Fragment> {
                  this.state.data.users.length !== 0 ? this.state.data.users.map((user, index) => {
                    return <Card key={index} className={classes.talkCard}>
                      <CardContent>
                        <Typography className={classes.talkName} align={"center"}>
                          Visitor {index + 1}
                        </Typography>
                        <Typography className={classes.speaker} align={"left"}>
                          <Face
                            className={classes.icon}/> {user.attributes.first_name + ' ' + user.attributes.last_name}
                          <span
                            className={classes.from}>from</span> {user.country}
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          <span className={classes.git}>Email</span>: <a
                          href={'mailto:' + user.email}>{user.email}</a>
                        </Typography>
                        <Typography className={classes.textCard} align={"left"}>
                          Visitor interests: {user.attributes.interests}
                        </Typography>
                      </CardContent>
                    </Card>
                  }) : <Typography className={classes.text} align={"center"}>
                    Sorry... We have no information about visitors :(
                  </Typography>
                }
                </React.Fragment>
              }
              <Typography align={"right"} className={classes.button}>
                {
                  isLogged && <IconButton className={classes.controlBtn} variant="contained" color={"primary"}
                                          onClick={this.makeReport}>
                    <ArrowDownward/>
                    Make report
                  </IconButton>
                }
                {
                  isLogged && <IconButton id='visit' ref='visit' variant="contained" color="primary"
                                          onClick={this.visitHandler}>
                    Want to visit
                    {
                      this.state.isVisited ? <CheckIcon className={classes.rightIcon}>-</CheckIcon> :
                        <AddIcon className={classes.rightIcon}>+</AddIcon>
                    }
                  </IconButton>
                }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore', 'ConferencesStore')(observer(ConferenceContainer)));
