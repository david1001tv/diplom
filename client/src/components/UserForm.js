import React, {PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import {numberInput} from '../helpers/validation';
import Tooltip from '@material-ui/core/Tooltip';


const styles = theme => ({
  userFields: {
    ...theme.mixins.gutters()
  },

  item: {
    '&:first-of-type': {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit,
    },

    '&:last-of-type': {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit * 3
    }
  },

  field: {
    paddingRight: theme.spacing.unit,
    width: '100%'
  },

  errors: {
    ...theme.mixins.gutters()
  }
});

class UserForm extends PureComponent {

  render() {
    const {classes, fields, errors, isEditing, handleChange} = this.props;
    console.log(fields)

    return <React.Fragment>
      <div className={classes.errors}>
        {Object.keys(errors).map(err => <Typography color='error' key={err}>
          {errors[err]}
        </Typography>)}
      </div>

      <Grid container>
        <Grid item xs={12} sm={6} className={classes.item}>
          <TextField
            label="Email"
            className={classes.field}
            value={fields.email}
            onChange={handleChange('email')}
            error={!!errors['email']}
            disabled={!!isEditing}
          />

          <TextField
            label="First Name"
            className={classes.field}
            value={fields.firstName}
            onChange={handleChange('firstName')}
          />

          <TextField
            label="Last name"
            className={classes.field}
            value={fields.lastName}
            onChange={handleChange('lastName')}
          />

          <Tooltip title='Is admin'>
            <label className={classes.field}>
              Is Admin

              <Switch
                checked={!!fields.isAdmin}
                onChange={handleChange('isAdmin')}
                color='primary'
              />
            </label>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6} className={classes.item}>

          <TextField
            label="Phone"
            className={classes.field}
            value={fields.phone}
            onChange={numberInput(handleChange('phone'))}
          />

          <TextField
            label="Country"
            className={classes.field}
            value={fields.country}
            onChange={handleChange('country')}
          />

          <TextField
            label="City"
            className={classes.field}
            value={fields.city}
            onChange={handleChange('city')}
          />

          <TextField
            label="Address"
            className={classes.field}
            value={fields.address}
            onChange={handleChange('address')}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(UserForm);
