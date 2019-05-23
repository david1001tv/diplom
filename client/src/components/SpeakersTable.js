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


const Transition = props => <Slide direction="up" {...props} />

const clearFields = () => ({
  speakerId: null,
  title: 'User creation',
  speakerFormFields: {
    email: '',
    policy: [],
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    address: ''
  }
})

const getSpeakerDataWithFallback = speaker => ({
  speakerFormFields: {
    email: get(speaker, 'email', ''),
    firstName: get(speaker, 'first_name', ''),
    lastName: get(speaker, 'last_name', ''),
    country: get(speaker, 'country._id', ''),
    github: get(speaker, 'github', ''),
    interests: get(speaker, 'interests', '')
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

class SpeakersTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields()
  }

  componentDidMount() {
    this.props.SpeakersStore.initialLoad();
    this.props.SpeakersStore.getCountries();
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
    const { speakerFormFields } = this.state;
    this.setState({
      speakerFormFields: {
        ...speakerFormFields,
        [name]: e.target.value
      }
    })
  }

  handleResetPasswort = () => {
    const { speakerId } = this.state;

    this.props.SpeakersStore.resetPassword(speakerId)
      .then(() => this.setState({isConfirmOpen: false}))
      .catch(err => console.log(err))
  }

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
  }

  handleChangePage = (_, page)  => this.props.SpeakersStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.SpeakersStore.handleChangeRowsPerPage(e.target.value);

  render() {
    const { title, isOpen, isConfirmOpen, errors, policies, speakerFormFields, speakerId } = this.state;
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
    } = this.props.SpeakersStore;

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
          <Button className={classes.controlBtn} onClick={this.props.SpeakersStore.makeReport}>
            <ArrowDownward/>
            Make report
          </Button>
          <TableDefault
            rows={this.buildRows(tableData)}
            columns={[
              'Name',
              'Email',
              'GitHub',
              'Country',
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
