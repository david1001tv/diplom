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

class TalkForm extends PureComponent {

  render() {
    const { classes, fields, errors, isEditing, handleChange, conferences, speakers } = this.props;

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

          <TextField
            label="Description"
            className={classes.field}
            value={fields.description}
            onChange={handleChange('description')}
          />

          <TextField
            label="Info"
            className={classes.field}
            value={fields.info}
            onChange={handleChange('info')}
          />

        </Grid>

        <Grid item xs={12} sm={6} className={classes.item}>

          <FormControl className={classes.field}>
            <InputLabel>Conference</InputLabel>
            <Select
              value={fields.conference}
              onChange={handleChange('conference')}
              input={<Input />}
            >
              {conferences.map(conference => <MenuItem key={conference._id} value={conference._id}>
                {conference.name}
              </MenuItem>)}
            </Select>
          </FormControl>

          <FormControl className={classes.field}>
            <InputLabel>Speaker</InputLabel>
            <Select
              value={fields.speaker}
              onChange={handleChange('speaker')}
              input={<Input />}
            >
              {speakers.map(speaker => <MenuItem key={speaker._id} value={speaker._id}>
                {speaker.first_name} {speaker.last_name}
              </MenuItem>)}
            </Select>
          </FormControl>

        </Grid>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(TalkForm);
