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
import ConferenceForm from './ConrefenceForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableSearch from './TableSearch';
import DialogActions from '@material-ui/core/DialogActions';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';

const Transition = props => <Slide direction="up" {...props} />

const clearFields = () => ({
  conferenceId: null,
  title: 'Conference creation',
  conferenceFormFields: {
    name: '',
    description: '',
    city: '',
    address: '',
    date: ''
  }
})

const getConferenceDataWithFallback = conference => ({
  conferenceFormFields: {
    name: get(conference, 'name', ''),
    description: get(conference, 'description', ''),
    city: get(conference, 'city._id', ''),
    address: get(conference, 'address', ''),
    date: Date.parse(get(conference, 'date', ''))
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

class ConferencesTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields(),
    cities: [],
    order: 'asc',
    orderBy: 'Name',
  }

  componentDidMount() {
    this.props.ConferencesStore.initialLoad();
    this.props.ConferencesStore.getCities();
    this.props.ConferencesStore.fetchAllItems('cities').then(res => {
      this.setState({
        cities: res.data
      })
    });
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
    console.log(e.target.value)
    const { conferenceFormFields } = this.state;
    this.setState({
      conferenceFormFields: {
        ...conferenceFormFields,
        [name]: e.target.value
      }
    })
  }

  saveConference = () => {
    console.log(this.state.conferenceFormFields)
    this.props.ConferencesStore.saveItem(
      this.state.conferenceFormFields,
      this.state.conferenceId
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
    return data.map(conference => ({
      name: conference.name,
      city: conference.city.name,
      date: this.props.ConferencesStore.formatDate(new Date(Date.parse(conference.date))),
      address: conference.address,
      control: this.controlTableRow(conference.deleted, conference._id)
    }))
  }

  deleteUsers = id => () => this.props.ConferencesStore.deleteItems(id);

  restoreUsers = ids => () => this.props.ConferencesStore.restoreItems(ids);

  onRowClick = (e, index) => {
    const conference = this.props.ConferencesStore.tableData[index];
    this.setState({
      isOpen: true,
      errors: {},
      title: `Edit conference ${conference.name}`,
      conferenceId: conference._id,
      ...getConferenceDataWithFallback(conference)
    });
  }

  createSortHandler = (orderBy, order) => {
    order = order === 'asc' ? 'desc' : 'asc';
    this.props.ConferencesStore.additionalQuery = `&sort[${orderBy.toLowerCase()}]=${order}`;
    this.props.ConferencesStore.loadData();
    this.setState({
      orderBy,
      order
    })
  }

  handleChangePage = (_, page)  => this.props.ConferencesStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.ConferencesStore.handleChangeRowsPerPage(e.target.value);

  render() {
    const { title, isOpen, isConfirmOpen, errors, conferenceFormFields, conferenceId, cities, order, orderBy } = this.state;
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
      loadData,
      cityQuery,
      changeCityQuery
    } = this.props.ConferencesStore;

    return <React.Fragment>
      <Grid item sm={6} className={classNames(classes.flexItem, classes.justifyEnd)}>
        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
          <Typography>City:</Typography>
          <Select
            multiple
            value={cityQuery}
            className={classes.field}
            onChange={changeCityQuery}
            input={<Input placeholder='Filter by city'/>}
          >
            {cities.map(city => <MenuItem key={city._id} value={city._id}>
              {city.name}
            </MenuItem>)}
          </Select>
        </Grid>


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
            Create conference
          </Button>
          <Button className={classes.controlBtn} onClick={this.props.ConferencesStore.makeReport}>
            <ArrowDownward/>
            Make report
          </Button>
          <TableDefault
            rows={this.buildRows(tableData)}
            columns={[
              {
                name: 'Name',
                sort: true
              },
              {
                name: 'City',
                sort: false
              },
              {
                name: 'Date',
                sort: true
              },
              {
                name: 'Address',
                sort: true
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

          <ConferenceForm
            isEditing={conferenceId}
            fields={conferenceFormFields}
            errors={errors}
            handleChange={this.handleChange}
            cities={cities}
          />

          <DialogActions>
            }
            <Button onClick={this.closeDialog} color="primary">
              Close
            </Button>
            <Button onClick={this.saveConference} color="primary" disabled={isLoading}>
              {conferenceId ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('AppStore', 'ConferencesStore')(observer(ConferencesTable)));
