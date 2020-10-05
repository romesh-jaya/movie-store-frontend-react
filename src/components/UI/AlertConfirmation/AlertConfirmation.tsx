import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

import styles from './AlertConfirmation.css';

interface IProps {
  message: string;
  title: string;
  oKButtonText: string;
  onConfirmed: () => void;
  onCancelled: () => void;
}

const AlertConfirmation: React.FC<IProps> = (props) => {
  const { onConfirmed, message, onCancelled, title, oKButtonText } = props;

  return (
    <Dialog
      open
      onClose={onCancelled}
    >
      <DialogTitle>
        <div className={styles.header}>
          <div className={styles.title}>
            {title}
          </div>
          <div className={styles['close-button']}>
            <Button onClick={onCancelled}>
              <ClearIcon />
            </Button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <span className={styles['first-button']}>
          <Button onClick={onCancelled} color="primary" variant="contained">
            Cancel
          </Button>
        </span>
        <Button
          onClick={onConfirmed}
          autoFocus
          color="secondary"
          variant="contained"
        >
          {oKButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertConfirmation;