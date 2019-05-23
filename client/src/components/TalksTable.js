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
import TalkForm from './TalkForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableSearch from './TableSearch';
import DialogActions from '@material-ui/core/DialogActions';


const Transition = props => <Slide direction="up" {...props} />

const clearFields = () => ({
  talkId: null,
  title: 'User creation',
  talkFormFiled: {
    name: '',
    description: '',
    info: '',
    conference: '',
    speaker: ''
  }
})

const getTalkDataWithFallback = speaker => ({
  talkFormFiled: {
    name: get(speaker, 'name', ''),
    description: get(speaker, 'description', ''),
    info: get(speaker, 'info', ''),
    conference: get(speaker, 'conference._id', ''),
    speaker: get(speaker, 'speaker._id', '')
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

class TalksTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields()
  }

  componentDidMount() {
    this.props.TalksStore.initialLoad();
    this.props.TalksStore.getConferences();
    this.props.TalksStore.getSpeakers();
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
    const { talkFormFiled } = this.state;
    this.setState({
      talkFormFiled: {
        ...talkFormFiled,
        [name]: e.target.value
      }
    })
  }

  handleResetPasswort = () => {
    const { talkId } = this.state;

    this.props.TalksStore.resetPassword(talkId)
      .then(() => this.setState({isConfirmOpen: false}))
      .catch(err => console.log(err))
  }

  saveTalk = () => {
    this.props.TalksStore.saveItem(
      this.state.talkFormFiled,
      this.state.talkId
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
    return data.map(talk => ({
      name: talk.name,
      conference: talk.conference.name,
      speaker: `${talk.speaker.first_name} ${talk.speaker.last_name}`,
      control: this.controlTableRow(talk.deleted, talk._id)
    }))
  }

  deleteUsers = id => () => this.props.TalksStore.deleteItems(id);

  restoreUsers = ids => () => this.props.TalksStore.restoreItems(ids);

  onRowClick = (e, index) => {
    const talk = this.props.TalksStore.tableData[index];
    this.setState({
      isOpen: true,
      errors: {},
      title: `Edit talk ${talk.name}`,
      talkId: talk._id,
      ...getTalkDataWithFallback(talk)
    });
  }

  handleChangePage = (_, page)  => this.props.TalksStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.TalksStore.handleChangeRowsPerPage(e.target.value);

  render() {
    const { title, isOpen, isConfirmOpen, errors, policies, talkFormFiled, talkId } = this.state;
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
      conferences,
      speakers,
      loadData
    } = this.props.TalksStore;

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
              'Conference',
              'Speaker',
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

          <TalkForm
            isEditing={talkId}
            fields={talkFormFiled}
            errors={errors}
            handleChange={this.handleChange}
            conferences={conferences}
            speakers={speakers}
          />

          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Close
            </Button>
            <Button onClick={this.saveTalk} color="primary" disabled={isLoading}>
              {talkId ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  }
}

export default withStyles(styles)(inject('TalksStore')(observer(TalksTable)));
