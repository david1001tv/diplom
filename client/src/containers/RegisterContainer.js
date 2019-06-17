import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {
  Redirect,
} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Api from '../Api';
import Header from "../components/Header";

const styles = theme => ({
  registerPaper: {
    ...theme.mixins.gutters(),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingBottom: theme.spacing.unit,
    '@media (max-width: 1024px)': {
      top: '60%',
      width: '90%'
    }
  },

  textField: {
    width: '100%'
  },

  citySelect: {
    width: '100%'
  },

  button: {
    marginTop: theme.spacing.unit * 2,
    width: '100%'
  }
});

class RegisterContainer extends Component {
  constructor(props) {
    super(props);

    this.from = null
  }

  state = {
    errorMessage: ''
  };

  componentDidMount() {

  }

  submitForm = e => {
    e.preventDefault();
    const {login, email, password, firstName, lastName, city, country, phone} = this.form.elements;

    Api.post('auth/register', JSON.stringify({
      login: login.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      city: city.value,
      country: country.value,
      phone: phone.value,
      password: password.value
    })).then(res => {
      const {
        token
      } = res;
      localStorage.setItem('token', token);
      this.props.AppStore.isLogged = true;
    }).catch(err => this.setState({errorMessage: err.message}))
  };

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    const {errorMessage} = this.state;
    const {classes} = this.props;
    const {isLogged} = this.props.AppStore;

    return <div>
      <Header
        onSubmit={() => {}}
        handleClear={() => {}}
        isSearch={false}
      />
      {
        isLogged && <Redirect to='/'/>
      }
      <section>
        <Grid container spacing={0}>
          <Paper className={classes.registerPaper}>
            <form ref={node => this.form = node} onSubmit={this.submitForm}>
              {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
              <TextField
                id='login'
                label='Username'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='email'
                label='Email'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='firstName'
                label='First Name'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='lastName'
                label='Last Name'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='phone'
                label='Phone'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='city'
                label='City'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='country'
                label='Country'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <TextField
                id='password'
                label='Password'
                type='password'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <Button type='submit' variant='contained' color='primary' className={classes.button}>
                Register
              </Button>
            </form>
          </Paper>
        </Grid>
      </section>
    </div>
  }
}

export default withStyles(styles)(inject('AppStore', 'UsersStore')(observer(RegisterContainer)));
