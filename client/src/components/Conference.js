import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ALink from "@material-ui/core/Link";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import LongText from "./LongText";

const styles = theme => ({
  card: {
    paddingLeft: '25px'
  },
  title: {
    fontSize: 26,
    fontFamily: '\'Montaga\', serif;',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '30px 0px'
  },
  conferenceContainer: {
    margin: '30px 100px',
    '@media (max-width: 1024px)': {
      margin: '30px 10%',
    }
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

class Conference extends Component {
  constructor(props) {
    super(props);
  }

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

  render() {
    const {classes, conference} = this.props;

    return <Card className={classes.conferenceContainer}>
      <CardContent>
        <ALink className={classes.title} href={'/conferences/' + conference._id}>
          {conference.name}
        </ALink>
        <Typography className={classes.date}>
          {this.formatDate(new Date(Date.parse(conference.date)))} in {conference.city.name}
        </Typography>
        <LongText
          content={conference.description}
          limit={600}
          link={'/conferences/' + conference._id}
        />
      </CardContent>
    </Card>
  }
}

export default withStyles(styles)(Conference);
