import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';

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
    <Modal show onHide={onCancelled}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelled}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirmed}>
          {oKButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertConfirmation;
