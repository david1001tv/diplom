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
import SpeakerForm from './SpeakerForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableSearch from './TableSearch';
import DialogActions from '@material-ui/core/DialogActions';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import {Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";


const Transition = props => <Slide direction="up" {...props} />;

const clearFields = () => ({
  speakerId: null,
  title: 'Speaker creation',
  speakerFormFields: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    account: false
  }
});

const getSpeakerDataWithFallback = speaker => ({
  speakerFormFields: {
    email: get(speaker, 'email', ''),
    firstName: get(speaker, 'first_name', ''),
    lastName: get(speaker, 'last_name', ''),
    country: get(speaker, 'country._id', ''),
    github: get(speaker, 'github', ''),
    interests: get(speaker, 'interests', ''),
    account: false
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

class SpeakersTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields(),
    countries: [],
    order: 'asc',
    orderBy: 'Name',
  };

  componentDidMount() {
    this.props.SpeakersStore.initialLoad();
    this.props.SpeakersStore.getCountries();
    this.props.SpeakersStore.fetchAllItems('countries').then(res => {
      this.setState({
        countries: res.data
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
  };

  checkIsSwitcher = e => (e.target.type === 'checkbox');

  handleChange = name => e => {
    const { speakerFormFields } = this.state;
    this.setState({
      speakerFormFields: {
        ...speakerFormFields,
        [name]: this.checkIsSwitcher(e) ? e.target.checked : e.target.value
      }
    })
  };

  saveConference = () => {
    this.props.SpeakersStore.saveItem(
      this.state.speakerFormFields,
      this.state.speakerId
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
    return data.map(speaker => ({
      name: `${speaker.first_name} ${speaker.last_name}`,
      email: speaker.email,
      github: speaker.github,
      country: speaker.country.country_name,
      control: this.controlTableRow(speaker.deleted, speaker._id)
    }))
  }

  deleteUsers = id => () => this.props.SpeakersStore.deleteItems(id);

  restoreUsers = ids => () => this.props.SpeakersStore.restoreItems(ids);

  onRowClick = (e, index) => {
    const speaker = this.props.SpeakersStore.tableData[index];
    this.setState({
      isOpen: true,
      errors: {},
      title: `Edit speaker ${speaker.first_name} ${speaker.last_name}`,
      speakerId: speaker._id,
      ...getSpeakerDataWithFallback(speaker)
    });
  };

  handleChangePage = (_, page)  => this.props.SpeakersStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.SpeakersStore.handleChangeRowsPerPage(e.target.value);

  createSortHandler = (orderBy, order) => {
    order = order === 'asc' ? 'desc' : 'asc';
    if (orderBy === 'Name') {
      this.props.SpeakersStore.additionalQuery = `&sort[first_name]=${order}`;
    } else {
      this.props.SpeakersStore.additionalQuery = `&sort[${orderBy.toLowerCase()}]=${order}`;
    }
    this.props.SpeakersStore.loadData();
    console.log(order);
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
    const { title, isOpen, isConfirmOpen, errors, speakerFormFields, speakerId, countries, order, orderBy } = this.state;
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
      countryQuery,
      changeCountryQuery
    } = this.props.SpeakersStore;

    return <React.Fragment>
      <Grid item sm={6} className={classNames(classes.flexItem, classes.justifyEnd)}>
        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
          <Typography>Country:</Typography>
          <Select
            multiple
            value={countryQuery}
            className={classes.field}
            onChange={changeCountryQuery}
            input={<Input placeholder='Filter by country'/>}
          >
            {countries.map(country => <MenuItem key={country._id} value={country._id}>
              {country.country_name}
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
            Create speaker
          </Button>
          <Button className={classes.controlBtn} onClick={this.props.SpeakersStore.makeReport}>
            <ArrowDownward/>
            Make report
          </Button>
          <TableDefault
            rows={this.buildRows(tableData)}
            columns={[
              {
                name: 'Name',
                sort: true,
              },
              {
                name: 'Email',
                sort: true
              },
              {
                name: 'GitHub',
                sort: true
              },
              {
                name: 'Country',
                sort: false
              },
              'Control'
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

          <SpeakerForm
            isEditing={speakerId}
            fields={speakerFormFields}
            errors={errors}
            handleChange={this.handleChange}
            countries={countries}
          />

          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Close
            </Button>
            <Button onClick={this.saveConference} color="primary" disabled={isLoading}>
              {speakerId ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('SpeakersStore')(observer(SpeakersTable)));
