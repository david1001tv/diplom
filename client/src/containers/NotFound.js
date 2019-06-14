import React from 'react';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

const styles = theme => ({
  root: {
    marginTop: '25vh',
    textAlign: 'center'
  },
  icon: {
    fontSize: '6rem'
  }
});

const NotFoundBanner = ({classes}) => {
  return (
    <div className={classes.root}>
      <Typography>
        <HelpIcon className={classes.icon} color='inherit'/>
      </Typography>
      <Typography variant='h5' gutterBottom>
        Page not found
      </Typography>
      <Button variant='contained' component={Link} to='/'>
        To the main page
      </Button>
    </div>
  );
};

export default withStyles(styles)(NotFoundBanner);
