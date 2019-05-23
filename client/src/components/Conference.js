import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ALink from "@material-ui/core/Link";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import LongText from "./LongText";

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
    margin: '30px 100px'
  },
  date: {
    fontSize: '13px'
  },
  // content: {
  //   fontSize: '18px',
  //   padding: '15px 0px'
  // },
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
        <LongText
          content={"Ut et nulla ac velit vestibulum rhoncus nec eu leo. Nunc ullamcorper augue a eros blandit, ac molestie neque posuere. Sed posuere ut massa ac tempus. Nullam non porttitor dui. Mauris et mattis quam. Morbi aliquam ultricies suscipit. Sed at nisl commodo, vehicula metus nec, vulputate justo. Phasellus vulputate tempus fringilla. Fusce bibendum ante est, ut imperdiet leo facilisis ac. Sed tincidunt egestas dolor, eu pellentesque odio viverra ac. Nunc dignissim dolor justo, auctor aliquam nunc fringilla facilisis. Ut et nulla ac velit vestibulum rhoncus nec eu leo. Nunc ullamcorper augue a eros blandit, ac molestie neque posuere. Sed posuere ut massa ac tempus. Nullam non porttitor dui. Mauris et mattis quam. Morbi aliquam ultricies suscipit. Sed at nisl commodo, vehicula metus nec, vulputate justo. Phasellus vulputate tempus fringilla. Fusce bibendum ante est, ut imperdiet leo facilisis ac. Sed tincidunt egestas dolor, eu pellentesque odio viverra ac. Nunc dignissim dolor justo, auctor aliquam nunc fringilla facilisis."}
          limit={600}
          link={'/conferences/' + conference._id}
        />
    </CardContent>
  </Card>
  }
}

export default withStyles(styles)(Conference);
