import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { get } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import TableDefault from '../components/TableDefault';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import Refresh from '@material-ui/icons/Refresh';
import UserForm from './UserForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableSearch from './TableSearch';
import DialogActions from '@material-ui/core/DialogActions';
import DialogConfirm from './DialogConfirm';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';


const Transition = props => <Slide direction="up" {...props} />

const clearFields = () => ({
  userId: null,
  title: 'User creation',
  userFormFields: {
    email: '',
    policy: [],
    fname: '',
    lname: '',
    phone: '',
    country: '',
    city: '',
    address: ''
  }
})

const getUserDataWithFallback = user => ({
  userFormFields: {
    email: get(user, 'email', ''),
    policy: get(user, 'policy', []),
    fname: get(user, 'attributes.fname', ''),
    lname: get(user, 'attributes.lname', ''),
    phone: get(user, 'attributes.phone', ''),
    country: get(user, 'country._id', ''),
    city: get(user, 'attributes.city', ''),
    address: get(user, 'attributes.address', '')
  }
})

const styles = theme => ({
  controlBtn: {
    marginLeft: 'auto'
  },

  restoreBtn: {
    marginLeft: 20,
    marginRight: 'auto'
  },

  field: {
    width: 200,
    margin: '0 10px'
  },

  сontainer: {
    width: 'auto',
    margin: '0 5px'
  },

  clearBtn: {
    width: 'auto',
    padding: '4px 8px'
  },

  iconButton: {
    padding: 4
  },

  icon: {
    fontSize: 18
  },

  flexItem: {
    display: 'flex'
  },

  justifyEnd: {
    justifyContent: 'flex-end'
  },

  controlCol: {
    minWidth: 60
  }
});

class UsersTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields()
  }

  componentDidMount() {
    this.props.UsersStore.initialLoad();
    this.props.UsersStore.getCountries();
    // this.props.PoliciesStore.fetchAllItems().then(res => {
    //   this.setState({
    //     policies: res.data
    //   })
    // }).catch(err => console.log(err))
  }

  controlTableRow = (deleted, id) => {
    const { classes } = this.props;

    return <div className={classes.controlCol}>
      {deleted ? <React.Fragment>
          <IconButton className={classes.iconButton} onClick={this.restoreUsers([id])} aria-label="Close">
            <Refresh className={classes.icon} color='secondary'/>
          </IconButton>
          <IconButton className={classes.iconButton} onClick={this.deleteUsers([id])} aria-label="Close">
            <DeleteForever className={classes.icon} color='secondary'/>
          </IconButton>
        </React.Fragment>
        : <IconButton className={classes.iconButton} onClick={this.deleteUsers([id])} aria-label="Close">
          <Delete className={classes.icon} color='secondary'/>
        </IconButton>}
    </div>
  }

  handleChange = name => e => {
    const { userFormFields } = this.state;
    this.setState({
      userFormFields: {
        ...userFormFields,
        [name]: e.target.value
      }
    })
  }

  handleResetPasswort = () => {
    const { userId } = this.state;

    this.props.UsersStore.resetPassword(userId)
      .then(() => this.setState({isConfirmOpen: false}))
      .catch(err => console.log(err))
  }

  saveUser = () => {
    this.props.UsersStore.saveItem(
      this.state.userFormFields,
      this.state.userId
    ).then(this.closeDialog)
      .catch(err => {
        const { errors = {} } = err;
        this.setState({
          errors
        })
      })
  }

  openDialog = () => this.setState({
    isOpen: true,
    errors: {},
    ...clearFields()
  })

  closeDialog = () => this.setState({
    isOpen: false,
  })

  buildRows = (data) => {
    return data.map(user => ({
      name: `${user.attributes.first_name} ${user.attributes.last_name}`,
      email: user.email,
      username: user.login,
      phone: user.attributes.phone,
      control: this.controlTableRow(user.deleted, user._id)
    }))
  }

  deleteUsers = id => () => this.props.UsersStore.deleteItems(id);

  restoreUsers = ids => () => this.props.UsersStore.restoreItems(ids);

  onRowClick = (e, index) => {
    const user = this.props.UsersStore.tableData[index];
    this.setState({
      isOpen: true,
      errors: {},
      title: `Edit user ${user.username}`,
      userId: user._id,
      ...getUserDataWithFallback(user)
    });
  }

  handleChangePage = (_, page)  => this.props.UsersStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.UsersStore.handleChangeRowsPerPage(e.target.value);

  render() {
    const { title, isOpen, isConfirmOpen, errors, policies, userFormFields, userId } = this.state;
    const { classes } = this.props;
    const {
      tableData,
      page,
      limit,
      total,
      isLoading,
      changeQuery,
      clearQuery,
      query,
      clearFilters,
      countries,
      loadData
    } = this.props.UsersStore;

    return <React.Fragment>
      <Grid item sm={6} className={classNames(classes.flexItem, classes.justifyEnd)}>
        <Grid container justify='flex-end' alignItems='center' className={classes.сontainer}>
          <TableSearch
            onChange={changeQuery}
            handleClear={clearQuery}
            value={query}
            onSubmit={loadData}
          />
        </Grid>

        <Grid container justify='flex-end' alignItems='center' className={classes.сontainer}>
          <Button onClick={clearFilters} className={classes.clearBtn}>
            Clear
            <Clear />
          </Button>
        </Grid>

      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Button className={classes.controlBtn} onClick={this.openDialog}>
            <Add />
            Create user
          </Button>
          <TableDefault
            rows={this.buildRows(tableData)}
            columns={[
              'Name',
              'Email',
              'Username',
              'Phone',
              'Control'
            ]}
            onRowClick={this.onRowClick}
            page={page}
            limit={limit}
            total={total}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog
          open={isOpen}
          onClose={this.closeDialog}
          TransitionComponent={Transition}
        >
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>

          <UserForm
            isEditing={userId}
            fields={userFormFields}
            errors={errors}
            handleChange={this.handleChange}
            countries={countries}
            policies={policies}
          />

          <DialogActions>
            {userId &&
            <Button
              variant='contained'
              color='primary'
              className={classes.restoreBtn}
              onClick={() => this.setState({isConfirmOpen: true})}
            >
              Reset password
            </Button>
            }
            <Button onClick={this.closeDialog} color="primary">
              Close
            </Button>
            <Button onClick={this.saveUser} color="primary" disabled={isLoading}>
              {userId ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <DialogConfirm
          isOpen={isConfirmOpen}
          onClose={() => this.setState({isConfirmOpen: false})}
          onConfirm={this.handleResetPasswort}
        />
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('UsersStore')(observer(UsersTable)));
