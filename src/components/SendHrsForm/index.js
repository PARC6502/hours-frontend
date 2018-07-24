import React, { Component, Fragment } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { db } from '../../firebase';
import AuthUserContext from '../Session/AuthUserContext';
import UsersDropdown from './UsersDropdown';

const INITIAL_FIELDS = {
  user: '',
  service: '',
  amount: 0,
};

class SendHrsForm extends Component {
  state = {
    sendingType: '',
    fields: {
      ...INITIAL_FIELDS
    },
  };

  validate = () => {
    // return true if form is valid
    if (this.state.sendingType && this.state.fields.user && this.state.fields.amount) return true;
    if (this.state.sendingType && this.state.fields.service && this.state.fields.amount) return true;
    return false;
  };

  handleSubmit = () => {
    console.log(this.state.fields);
    const { id: fromUser } = this.props.user;
    const { user: toUser, service, amount } = this.state.fields;
    if (toUser) {
      db.sendHoursToUser(fromUser, toUser, amount);
    }
    const fields = {
      ...INITIAL_FIELDS
    };
    this.setState({ fields });
  };

  onSendingTypeSelect = (evt, {value}) => {
    const sendingType = value;
    const fields = {
      ...INITIAL_FIELDS
    };
    this.setState({ sendingType, fields });
  };

  onFormChange = (evt, {name, value}) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
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
        {this.state.sendingType==='user' ? 
          <UsersDropdown 
            onChange={this.onFormChange} 
            value={this.state.fields.user} /> : 
          <Fragment />}
        {this.state.sendingType==='service' 
          ? null
          : <Fragment />}
        {this.state.sendingType ? 
          <Form.Input 
            name="amount" 
            label="How much are you sending?" 
            type="number"
            value={this.state.fields.amount}
            onChange={this.onFormChange} /> : 
          <Fragment />}
        <Button className="ui basic fluid red button" disabled={!this.validate()}>Send Hrs</Button>
      </Form>
    );
  }
}

const SendHrsFormWithUser = () =>
  <AuthUserContext.Consumer>
    {user => <SendHrsForm user={user} />}
  </AuthUserContext.Consumer>

export default SendHrsFormWithUser;