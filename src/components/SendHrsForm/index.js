import React, { Component, Fragment } from 'react';
import { Form } from 'semantic-ui-react';

import SendHrsToUser from './SendHrsToUser';

class SendHrsForm extends Component {
  state = {
    sendingType: '',
  };

  onSendingTypeSelect = (evt, {value}) => {
    const sendingType = value;
    this.setState({ sendingType });
  };

  render() {
    return (
      <Fragment>
        <Form>
          <Form.Group inline>
            <Form.Radio 
              name="sendingType"
              label='Spend on service or product' 
              value='service' 
              checked={this.state.sendingType === 'service'} 
              onChange={this.onSendingTypeSelect} />
            <Form.Radio
              name="sendingType" 
              label='Send to other user' 
              value='user' 
              checked={this.state.sendingType === 'user'} 
              onChange={this.onSendingTypeSelect} />
          </Form.Group>
        </Form>
        {this.state.sendingType === 'user'  
        ? <SendHrsToUser />
        : null}
      </Fragment>
    );
  }
}

export default SendHrsForm;