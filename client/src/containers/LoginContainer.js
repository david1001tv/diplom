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
import Header from "../components/Header";

const styles = theme => ({
  registerPaper: {
    ...theme.mixins.gutters(),
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '30%',
    transform: 'translate(-50%, -50%)',
    paddingBottom: theme.spacing.unit,
    '@media (max-width: 1024px)': {
      width: '95%',
    }
  },

  textField: {
    width: '100%'
  },

  button: {
    marginTop: theme.spacing.unit * 2,
    width: '100%'
  }
});

class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.from = null
  }

  state = {
    errorMessage: ''
  };

  submitForm = e => {
    e.preventDefault()
    const [login, pass] = this.form.elements

    this.props.AppStore.logIn(login.value, pass.value)
      .then(res => {
      })
      .catch(err => this.setState({errorMessage: err.message}))
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
                id='password'
                label='Password'
                type='password'
                className={classes.textField}
                margin='normal'
                required={true}
              />

              <Button type='submit' variant='contained' color='primary' className={classes.button}>
                Login
              </Button>
            </form>
          </Paper>
        </Grid>
      </section>
    </div>
  }
}

export default withStyles(styles)(inject('AppStore', 'UsersStore')(observer(LoginContainer)));
