import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ALink from "@material-ui/core/Link";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    paddingLeft: '25px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '30px 0px'
  },
  conferenceContainer: {
    margin: '30px 50px'
  },
  date: {
    fontSize: '13px'
  },
  content: {
    fontSize: '18px',
    padding: '15px 0px'
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
          {this.formatDate(new Date(Date.parse(conference.date)))}
        </Typography>
        <Typography className={classes.content}>
          {conference.description}
        </Typography>
      </CardContent>
    </Card>
  }
}

export default withStyles(styles)(Conference);
