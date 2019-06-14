import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogConfirm extends React.Component {


  render() {
    const {isOpen, title, content = '', onClose, onConfirm} = this.props;

    return (
      <div>
        <Dialog
          open={isOpen}
          onClose={onClose}
        >
          <DialogTitle>{title || 'Confirm action'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='primary'>
              Close
            </Button>
            <Button onClick={onConfirm} color='primary'>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DialogConfirm;
