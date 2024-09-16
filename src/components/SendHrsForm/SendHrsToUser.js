import React, { Component } from "react";
import { Form, Message } from "semantic-ui-react";

import { token, db } from "../../firebase";
import { FirebaseAuthUserContext } from "../Session/FirebaseAuthUserProvider";
import UsersDropdown from "./UsersDropdown";

const INITIAL_STATE = {
  selectedUserIndex: null,
  amount: 1,
  description: "",
  error: null,
  loading: false,
  users: []
};

class SendHrsToUser extends Component {
  state = {
    ...INITIAL_STATE
  };

  componentDidMount() {
    db.getUsers()
      .then(users => users.filter(user => user.id !== this.props.user.id))
      .then(users => this.setState({ users, loading: false }))
      .catch(error => console.log(error));
  }

  validate = () => {
    // return true if form is valid
    if (this.state.selectedUserIndex !== null && this.state.amount) return true;
    return false;
  };

  handleSubmit = () => {
    const fromUser = this.props.user;
    const { amount, selectedUserIndex, description } = this.state;
    const toUser = this.state.users[selectedUserIndex];
    this.setState({ loading: true });
    const details = { amount, description };
    token
      .sendTokens(fromUser, toUser, details)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .then(() => this.setState({ success: true }))
      .then(() => console.log("Transaction successful"))
      .catch(error => this.setState({ error }))
      .then(() => this.setState({ loading: false }));
  };

  onFormChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        error={this.state.error}
        success={this.state.success}
      >
        <UsersDropdown
          onChange={this.onFormChange}
          value={this.state.selectedUserIndex}
          loading={this.state.loading}
          users={this.state.users}
        />
        <Form.Input
          name="description"
          label="What's the reason for sending this impact?"
          type="text"
          value={this.state.description}
          onChange={this.onFormChange}
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
          content={this.state.error ? this.state.error.message : ""}
        />
        <Message
          success
          header="Form Success"
          content={this.state.success ? "Tokens sent successfully." : ""}
        />
        <Form.Button
          type="submit"
          color="green"
          fluid
          basic
          disabled={!this.validate()}
          loading={this.state.loading}
        >
          Send
        </Form.Button>
      </Form>
    );
  }
}

const SendHrsToUserWithAuthUser = props => (
  <FirebaseAuthUserContext.Consumer>
    {user => <SendHrsToUser user={user} />}
  </FirebaseAuthUserContext.Consumer>
);

export default SendHrsToUserWithAuthUser;
