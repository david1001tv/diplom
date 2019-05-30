import React, {PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import {numberInput} from '../helpers/validation';
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

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

class SpeakersForm extends PureComponent {

  render() {
    const {classes, fields, errors, isEditing, handleChange, countries} = this.props;
    console.log(fields);

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

          {
            !isEditing && <Tooltip title='Is create account'>
              <label className={classes.field}>
                Is create account
                <Switch
                  checked={!!fields.account}
                  onChange={handleChange('account')}
                  color='primary'
                />
              </label>
            </Tooltip>
          }

        </Grid>

        <Grid item xs={12} sm={6} className={classes.item}>

          <TextField
            label="GitHub"
            className={classes.field}
            value={fields.github}
            onChange={handleChange('github')}
          />

          <FormControl className={classes.field}>
            <InputLabel>Country</InputLabel>
            <Select
              value={fields.country}
              onChange={handleChange('country')}
              input={<Input/>}
            >
              {countries.map(country => <MenuItem key={country._id} value={country._id}>
                {country.country_name}
              </MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Interests"
            className={classes.field}
            value={fields.interests}
            onChange={handleChange('interests')}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(SpeakersForm);
