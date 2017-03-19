import React from 'react';
import { connect } from 'react-redux'

import * as actions from './Actions';

let mapStateToProps = (state) => {
  return {
    showModal: state.showModal,
    title: state.title,
    type: state.type
  };
}

let createHandlers = (dispatch) => {
  return {
    close: () => {
    	dispatch(actions.closeBookingAction());
    },
    validate: () => {
      dispatch(actions.validateBookingAction());
    }
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFooter() {
    if (this.props.type === 'OkCancel') {
      return (
        <footer className='rc-modal-footer'>
          <button className='rc-modal-button' onClick={this.props.validate}>Ok</button>
          <button className='rc-modal-button' onClick={this.props.close}>Cancel</button>
        </footer>
      )
    }
  }

  renderBody() {
    const props = {...this.props.body.props, ...{ close: this.props.close }}
    return (
      <div className='rc-modal-body'>
        { React.cloneElement(this.props.body, props) }
      </div>
    )
  }

  render() {
    const modalCss = this.props.showModal ? 'rc-modal in' : 'rc-modal';
    return (
      <div className={modalCss}>
        <div className='rc-modal-dialog'>
          <header className='rc-modal-header'>{this.props.title}</header>
          {this.renderBody()}
          {this.renderFooter()}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, createHandlers)(Modal)
