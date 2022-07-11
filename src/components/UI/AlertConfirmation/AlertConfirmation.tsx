import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './alertConfirmation.module.css';

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
    <Dialog open onClose={onCancelled}>
      <DialogTitle>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles['close-button']}>
            <Button onClick={onCancelled}>
              <ClearIcon />
            </Button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <span className={styles['first-button']}>
          <Button onClick={onCancelled} color="primary" variant="contained">
            Cancel
          </Button>
        </span>
        <Button onClick={onConfirmed} color="secondary" variant="contained">
          {oKButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertConfirmation;
