import React, { Component, Fragment } from "react";
import { Form, Button } from "semantic-ui-react";

import databaseController from "../databaseController";

class SendHrsForm extends Component {
  state = {
    sendingType: "",
    fields: {
      user: "",
      service: "",
      amount: 0
    }
  };

  validate = () => {
    // return true if form is valid
    if (
      this.state.sendingType &&
      this.state.fields.user &&
      this.state.fields.amount
    )
      return true;
    if (
      this.state.sendingType &&
      this.state.fields.service &&
      this.state.fields.amount
    )
      return true;
    return false;
    // return (this.state.sendingType && (this.state.fields.user || this.state.fields.service));
  };

  handleSubmit = () => {
    if (this.state.fields.user) {
      databaseController.sendHoursToUser(
        this.state.fields.user,
        this.state.fields.amount
      );
    }
    const fields = {
      user: "",
      service: "",
      amount: 0
    };
    this.setState({ fields });
  };

  onSendingTypeSelect = (evt, { value }) => {
    const sendingType = value;
    const fields = {
      user: "",
      service: "",
      amount: 0
    };
    this.setState({ sendingType, fields });
  };

  onFormChange = (evt, { name, value }) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {/* <Form.Group inline>
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
          <Fragment />} */}
        {this.state.sendingType === "service" ? (
          <ServicesDropdown
            onChange={this.onFormChange}
            value={this.state.fields.service}
          />
        ) : (
          <Fragment />
        )}
        {this.state.sendingType ? (
          <Form.Input
            name="amount"
            label="How much are you sending?"
            type="number"
            value={this.state.fields.amount}
            onChange={this.onFormChange}
          />
        ) : (
          <Fragment />
        )}
        <Button
          className="ui basic fluid red button"
          disabled={!this.validate()}
        >
          Send features coming soon{" "}
        </Button>
      </Form>
    );
  }
}

class UsersDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    databaseController.getUsers().then(users => this.setState({ users }));
  }

  render() {
    const userOptions = this.state.users.map(user => ({
      text: user.name,
      value: user.id
    }));
    return (
      <Form.Select
        name="user"
        fluid
        search
        selection
        label="Pick a user from the dropdown, or type their name"
        placeholder="Select a user..."
        options={userOptions}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

class ServicesDropdown extends Component {
  state = {
    value: this.props.value,
    services: []
  };

  onChange = (evt, { name, value }) => {
    this.setState({ value });
    this.props.onChange(evt, { name, value });
  };

  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }

  componentDidMount() {
    this.setState({ services: databaseController.getServices() });
  }

  render() {
    const serviceOptions = this.state.services.map(service => ({
      text: `${service.name} - ${service.cost} hrs`,
      value: service.id
    }));
    return (
      <Form.Select
        name="service"
        fluid
        search
        selection
        label="Pick a service, or product, from the dropdown"
        placeholder="Select a service..."
        options={serviceOptions}
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}

export default SendHrsForm;
