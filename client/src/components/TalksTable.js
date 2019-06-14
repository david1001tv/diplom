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
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import {Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";


const Transition = props => <Slide direction="up" {...props} />;

const clearFields = () => ({
  talkId: null,
  title: 'Talk creation',
  talkFormFiled: {
    name: '',
    description: '',
    info: '',
    conference: '',
    speaker: ''
  }
});

const getTalkDataWithFallback = speaker => ({
  talkFormFiled: {
    name: get(speaker, 'name', ''),
    description: get(speaker, 'description', ''),
    info: get(speaker, 'info', ''),
    conference: get(speaker, 'conference._id', ''),
    speaker: get(speaker, 'speaker._id', '')
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

class TalksTable extends Component {

  state = {
    isOpen: false,
    isConfirmOpen: false,
    errors: {},
    policies: [],
    ...clearFields(),
    conferences: [],
    speakers: [],
    order: 'asc',
    orderBy: 'Name'
  };

  componentDidMount() {
    this.props.TalksStore.initialLoad();
    this.props.TalksStore.getConferences();
    this.props.TalksStore.getSpeakers();
    this.props.TalksStore.fetchAllItems('conferences').then(res => {
      this.setState({
        conferences: res.data
      })
    });
    this.props.TalksStore.fetchAllItems('speakers').then(res => {
      this.setState({
        speakers: res.data
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

  handleChange = name => e => {
    const { talkFormFiled } = this.state;
    this.setState({
      talkFormFiled: {
        ...talkFormFiled,
        [name]: e.target.value
      }
    })
  };

  handleResetPasswort = () => {
    const { talkId } = this.state;

    this.props.TalksStore.resetPassword(talkId)
      .then(() => this.setState({isConfirmOpen: false}))
      .catch(err => console.log(err))
  };

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
    return data.map(talk => ({
      name: talk.name,
      conference: talk.conference.name,
      speaker: `${talk.speaker.first_name} ${talk.speaker.last_name}`,
      control: this.controlTableRow(talk.deleted, talk._id)
    }))
  };

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
  };

  handleChangePage = (_, page)  => this.props.TalksStore.handleChangePage(page);

  handleChangeRowsPerPage = e => this.props.TalksStore.handleChangeRowsPerPage(e.target.value);

  createSortHandler = (orderBy, order) => {
    order = order === 'asc' ? 'desc' : 'asc';
    this.props.TalksStore.additionalQuery = `&sort[${orderBy.toLowerCase()}]=${order}`;
    this.props.TalksStore.loadData();
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
    const { title, isOpen, isConfirmOpen, errors, talkFormFiled, talkId, conferences, speakers, order, orderBy } = this.state;
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
      conferenceQuery,
      changeConferenceQuery,
      speakerQuery,
      changeSpeakerQuery
    } = this.props.TalksStore;

    return <React.Fragment>
      <Grid item sm={6} className={classNames(classes.flexItem, classes.justifyEnd)}>
        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
          <Typography>Conferences:</Typography>
          <Select
            multiple
            value={conferenceQuery}
            className={classes.field}
            onChange={changeConferenceQuery}
            input={<Input placeholder='Filter by conference'/>}
          >
            {conferences.map(conference => <MenuItem key={conference._id} value={conference._id}>
              {conference.name}
            </MenuItem>)}
          </Select>
        </Grid>

        <Grid container justify='flex-end' alignItems='center' className={classes.container}>
          <Typography>Speakers:</Typography>
          <Select
            multiple
            value={speakerQuery}
            className={classes.field}
            onChange={changeSpeakerQuery}
            input={<Input placeholder='Filter by speaker'/>}
          >
            {speakers.map(speaker => <MenuItem key={speaker._id} value={speaker._id}>
              {speaker.first_name} {speaker.last_name}
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
            Create talk
          </Button>
          <Button className={classes.controlBtn} onClick={this.props.TalksStore.makeReport}>
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
                name: 'Conference',
                sort: false
              },
              {
                name: 'Speaker',
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
