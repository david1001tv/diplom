import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
  contentText: {
    fontSize: 16,
    padding: '15px 0px',
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    lineHeight: 1.43,
    color: '#333'
  },
  linkSpoiler: {
    cursor: 'pointer'
  }
});

class LongText extends Component {
  render() {
    const {content, limit, classes, link} = this.props;

    if (content.length <= limit) {
      return <div className={classes.contentText}>{content}</div>
    }

    const toShow = content.substring(0, limit) + "...";
    return <div className={classes.contentText}>
      {toShow}
      <a className={classes.linkSpoiler} href={link}>Read more</a>
    </div>
  }
}

export default withStyles(styles)(LongText);