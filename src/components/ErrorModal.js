import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class ErrorModal extends React.Component {
  render() {
    return(
      <Modal
        size='lg'
        show={this.props.show}
        onHide={this.props.handleCloseErrorModal}
        centered
      >
        <Modal.Header>
          <Modal.Title>{`An Error Has Occured (╯°□°）╯︵ ┻━┻`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`Error ${this.props.errorCode}: ${this.props.errorDescription}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleCloseErrorModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ErrorModal;
