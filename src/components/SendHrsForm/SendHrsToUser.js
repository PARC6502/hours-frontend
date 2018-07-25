import React, { Component } from "react";
import { Form } from "semantic-ui-react";

import { db } from "../../firebase";
import AuthUserContext from "../Session/AuthUserContext";
import UsersDropdown from "./UsersDropdown";

const INITIAL_STATE = {
  user: "",
  amount: 0
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
    db.sendHoursToUser(fromUser, toUser, amount);
    this.setState({ ...INITIAL_STATE });
  };

  onFormChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <UsersDropdown
          onChange={this.onFormChange}
          value={this.state.user}
        />
        <Form.Input
          name="amount"
          label="How much are you sending?"
          type="number"
          value={this.state.amount}
          onChange={this.onFormChange}
        />
        <Form.Button
          type='submit'
          color='red'
          fluid basic
          disabled={!this.validate()}
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
