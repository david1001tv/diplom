import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import NotFound from './containers/NotFound';
import LoginContainer from './containers/LoginContainer'
import LandingContainer from './containers/LandingContainer';
import RegisterContainer from './containers/RegisterContainer';
import ConferenceContainer from './containers/ConferenceContainer';
import ProfileContainer from './containers/ProfileContainer';
import AdminContainer from './containers/AdminContainer';

const styles = theme => ({
  section: {
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 15
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
        <CssBaseline/>
        <Switch>
          <Route exact path='/' render={props => <LandingContainer {...props}
                                                                   content={'conferences'}
                                                                   dataLengthLimit={1}
                                                                   defaultHeight={230}
                                                                   componentHeight={180}/>}/>
          <Route exact path='/talks' render={props => <LandingContainer {...props}
                                                                        content={'talks'}
                                                                        dataLengthLimit={2}
                                                                        defaultHeight={480}
                                                                        componentHeight={370}
                                                                        text={'Our Talks'}/>}/>
          <Route exact path='/speakers' render={props => <LandingContainer {...props}
                                                                           content={'speakers'}
                                                                           dataLengthLimit={2}
                                                                           defaultHeight={350}
                                                                           componentHeight={350}
                                                                           text={'Our Speakers'}/>}/>
          <Route exact path='/login' render={props => <LoginContainer {...props} />}/>
          <Route exact path='/register' render={props => <RegisterContainer {...props} />}/>
          <Route exact path='/profile' render={props => <ProfileContainer {...props} />}/>
          <Route exact path='/conferences/:id' render={props => <ConferenceContainer {...props}/>}/>
          <Route exact path='/admin' render={props => <AdminContainer {...props} />}/>

          <Route path='/' component={NotFound}/>
        </Switch>
      </Router>
    )
  }
}

export default withStyles(styles)(inject('AppStore')(observer(Routes)));
