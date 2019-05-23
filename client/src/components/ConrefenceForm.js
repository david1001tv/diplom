import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { numberInput } from '../helpers/validation';

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


class ConferenceForm extends PureComponent {
  parseDate = date => {
    date = new Date(date);
    return date.getFullYear() + '-' + (date.getMonth() > 10 ? date.getMonth() : '0' + date.getMonth()) + '-' + (date.getDay() > 10 ? date.getDay() : '0' + date.getDay());
  }

  render() {
    const { classes, cities, fields, errors, isEditing, handleChange } = this.props;
    fields.date = this.parseDate(fields.date);

    return <React.Fragment>
      <div className={classes.errors}>
        {Object.keys(errors).map(err => <Typography color='error' key={err}>
          {errors[err]}
        </Typography>)}
      </div>

      <Grid container>
        <Grid item xs={12} sm={6} className={classes.item}>
          <TextField
            label="Name"
            className={classes.field}
            value={fields.name}
            onChange={handleChange('name')}
            error={!!errors['name']}
          />

          <FormControl className={classes.field}>
            <InputLabel>City</InputLabel>
            <Select
              value={fields.city}
              onChange={handleChange('city')}
              input={<Input />}
            >
              {cities.map(city => <MenuItem key={city._id} value={city._id}>
                {city.name}
              </MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Address"
            className={classes.field}
            value={fields.address}
            onChange={handleChange('address')}
          />

        </Grid>

        <Grid item xs={12} sm={6} className={classes.item}>

          <TextField
            label="Description"
            className={classes.field}
            value={fields.description}
            onChange={handleChange('description')}
          />

          <TextField
            className={classes.field}
            defaultValue={fields.date}
            type="date"
            onChange={handleChange('date')}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(ConferenceForm);
