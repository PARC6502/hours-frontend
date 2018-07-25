import React, { Component } from "react";
import { Form, Message } from "semantic-ui-react";

import { db } from "../../firebase";
import AuthUserContext from "../Session/AuthUserContext";
import UsersDropdown from "./UsersDropdown";

const INITIAL_STATE = {
  user: '',
  amount: 1,
  error: null,
  loading: false,
};

class SendHrsToUser extends Component {
  state = {
    ...INITIAL_STATE
  }
  
  validate = () => {
    // return true if form is valid
    if (
      this.state.user &&
      this.state.amount
    )
      return true;
    return false;
  };

  handleSubmit = () => {
    const { id: fromUser } = this.props.user;
    const { user: toUser, amount } = this.state;
    this.setState({ loading: true });
    db.sendHoursToUser(fromUser, toUser, amount)
    .then(() => this.setState({ ...INITIAL_STATE }))
    .then(() => console.log('Transaction successful'))
    .catch(error => this.setState({ error }))
    .then(() => this.setState({ loading: false }));
  };

  onFormChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} error={this.state.error}>
        <UsersDropdown
          onChange={this.onFormChange}
          value={this.state.user}
          user={this.props.user}
        />
        <Form.Input
          name="amount"
          label="How much are you sending?"
          type="number"
          value={this.state.amount}
          onChange={this.onFormChange}
        />
        <Message
          error
          header="Form Error"
          content={this.state.error ? this.state.error.message : ''} />
        <Form.Button
          type='submit'
          color='red'
          fluid basic
          disabled={!this.validate()}
          loading={this.state.loading}
        >
          Send Hrs
        </Form.Button>
      </Form>
    );
  }
}

const SendHrsToUserWithAuthUser = (props) =>
  <AuthUserContext.Consumer>
    {user => <SendHrsToUser user={user} />}
  </AuthUserContext.Consumer>

export default SendHrsToUserWithAuthUser;
