import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import NotFound from './containers/NotFound';
import LoginContainer from './containers/LoginContainer'

const styles = theme => ({
  section: {
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 7
  },
});

class Routes extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {classes} = this.props;
    const {isLogged} = this.props.AppStore;

    return (
      <Router>
        {/*<>*/}
        <CssBaseline/>
        <section className={classNames({[classes.section]: isLogged})}>
          <Switch>
            <Route exact path='/login' render={props => <LoginContainer {...props} />}/>
            <Route path='/' component={NotFound}/>
          </Switch>
        </section>
        {/*</>*/}
      </Router>
    )
  }
}

export default withStyles(styles)(inject('AppStore')(observer(Routes)));
