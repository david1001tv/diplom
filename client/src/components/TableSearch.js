import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { fade } from '@material-ui/core/styles/colorManipulator';


const styles = theme => ({
  search: {
    alignSelf: 'center',
    display: 'inline-flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    }
  },

  icon: {
    height: '100%',
    display: 'inline-flex',
    alignSelf: 'center',

    '&:hover': {
      cursor: 'pointer'
    }
  },

  hiddenIcon: {
    display: 'none'
  }
});

class TableSearch extends Component {

  submitForm = e => {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const { classes, onChange, value, handleClear } = this.props;

    return <form className={classes.search} onSubmit={this.submitForm}>
      <div className={classes.icon}>
        <SearchIcon />
      </div>
      <InputBase
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder='Search…'
      />
      <div className={value.length === 0 ? classes.hiddenIcon : classes.icon} onClick={handleClear}>
        <CloseIcon/>
      </div>
    </form>
  }
}

export default withStyles(styles)(TableSearch);
