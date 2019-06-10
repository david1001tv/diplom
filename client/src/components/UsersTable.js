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
import ArrowDownward from '@material-ui/icons/ArrowDownward'


const Transition = props => <Slide direction="up" {...props} />;

const clearFields = () => ({
  userId: null,
  title: 'User creation',
  userFormFields: {
    email: '',
    policy: [],
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    isAdmin: false
  }
});

const getUserDataWithFallback = user => ({
  userFormFields: {
    email: get(user, 'email', ''),
    policy: get(user, 'policy', []),
    firstName: get(user, 'attributes.first_name', ''),
    lastName: get(user, 'attributes.last_name', ''),
    phone: get(user, 'attributes.phone', ''),
    country: get(user, 'attributes.country', ''),
    city: get(user, 'attributes.city', ''),
    address: get(user, 'attributes.address', ''),
    isAdmin: get(user, 'is_admin', false)
  }
});

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

  container: {
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
    ...clearFields(),
    order: 'asc',
    orderBy: 'Email',
  };

  componentDidMount() {
    this.props.UsersStore.initialLoad();
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
  };

  checkIsSwitcher = e => (e.target.type === 'checkbox');

  handleChange = name => e => {
    const { userFormFields } = this.state;
    this.setState({
      userFormFields: {
        ...userFormFields,
        [name]: this.checkIsSwitcher(e) ? e.target.checked : e.target.value
      }
    })
  };

  handleResetPassword = () => {
    const { userId } = this.state;

    this.props.UsersStore.resetPassword(userId)
      .then(() => this.setState({isConfirmOpen: false}))
      .catch(err => console.log(err))
  };

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
  };

  openDialog = () => this.setState({
    isOpen: true,
    errors: {},
    ...clearFields()
  });

  closeDialog = () => this.setState({
    isOpen: false,
  });

  buildRows = (data) => {
    return data.map(user => ({
      name: `${user.attributes.first_name} ${user.attributes.last_name}`,
      email: user.email,
      username: user.login,
      phone: user.attributes.phone,
      control: this.controlTableRow(user.deleted, user._id)
    }))
  };

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
  };

  handleChangePage = (_, page)  => this.props.UsersStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.UsersStore.handleChangeRowsPerPage(e.target.value);

  createSortHandler = (orderBy, order) => {
    order = order === 'asc' ? 'desc' : 'asc';
    if (orderBy === 'Username') {
      this.props.UsersStore.additionalQuery = `&sort[login]=${order}`;
    } else {
      this.props.UsersStore.additionalQuery = `&sort[${orderBy.toLowerCase()}]=${order}`;
    }
    this.props.UsersStore.loadData();
    if (this.state.orderBy === orderBy) {
      this.setState({
        order: order
      })
    } else {
      this.setState({
        orderBy: orderBy,
        order: order
      })
    }
  };

  render() {
    const { title, isOpen, isConfirmOpen, errors, policies, userFormFields, userId, order, orderBy } = this.state;
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
        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
          <TableSearch
            onChange={changeQuery}
            handleClear={clearQuery}
            value={query}
            onSubmit={loadData}
          />
        </Grid>

        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
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
          <Button className={classes.controlBtn} onClick={this.props.UsersStore.makeReport}>
            <ArrowDownward/>
            Make report
          </Button>
          <TableDefault
            rows={this.buildRows(tableData)}
            columns={[
              {
                name: 'Name',
                sort: false
              },
              {
                name: 'Email',
                sort: true
              },
              {
                name: 'Username',
                sort: true
              },
              {
                name: 'Phone',
                sort: false
              },
              {
                name: 'Control',
                sort: false
              }
            ]}
            onRowClick={this.onRowClick}
            page={page}
            limit={limit}
            total={total}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            order={order}
            orderBy={orderBy}
            createSortHandler={this.createSortHandler}
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
          onConfirm={this.handleResetPassword}
        />
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('UsersStore')(observer(UsersTable)));
