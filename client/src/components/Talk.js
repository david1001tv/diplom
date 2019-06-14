import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Face from '@material-ui/icons/Face';
import Card from "@material-ui/core/Card";
import React, {Component} from "react";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
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
    width: '41%',
    height: 330,
    marginTop: 50,
    marginLeft: '6%',
    display: 'inline-block',
    '@media (max-width: 1024px)': {
      width: '90%',
      marginLeft: '5%',
    }
  },
  talkName: {
    fontSize: 23,
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
});

class Talk extends Component {

  render() {
    const {classes, talk, index} = this.props;

    return <Card key={index} className={classes.talkCard}>
      <CardContent>
        <Typography className={classes.talkName} align={"left"}>
          Conference: <a href={'conferences/' + talk.conference._id}>{talk.conference.name}</a>
        </Typography>
        <Typography className={classes.talkName} align={"center"}>
          {talk.name}
        </Typography>
        <Typography className={classes.speaker} align={"left"}>
          <Face className={classes.icon}/> {talk.speaker.first_name + ' ' + talk.speaker.last_name} <span
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
  }
}

export default withStyles(styles)(Talk);
