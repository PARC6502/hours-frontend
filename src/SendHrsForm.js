import React, { Component, Fragment } from 'react';
import { Form, Button } from 'semantic-ui-react';
import databaseController from './databaseController';

class SendHrsForm extends Component {
  state = {
    fields: {
      sendingType: '',
      user: '',
      service: '',
    },
  };

  handleSubmit = () => {
    console.log("form submitted");
    console.log(this.state.fields);
    const fields = {
      service: '',
    };
    this.setState({ fields });
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
            checked={this.state.fields.sendingType === 'service'} 
            onChange={this.onFormChange} />
          <Form.Radio
            name="sendingType" 
            label='Send to other user' 
            value='user' 
            checked={this.state.fields.sendingType === 'user'} 
            onChange={this.onFormChange} />

        </Form.Group>
        {this.state.fields.sendingType==='user' ? <UsersDropdown onChange={this.onFormChange} value={this.state.fields.user} /> : <Fragment />}
        {this.state.fields.sendingType==='service' ? <ServicesDropdown onChange={this.onFormChange} value={this.state.fields.service} /> : <Fragment />}
        <Button className="ui basic fluid red button">Send Hrs</Button>
      </Form>
    );
  }
}

class UsersDropdown extends Component {
  state = {
    value: this.props.value,
    users: [],
  };

  onChange = (evt, {name, value}) => {
    this.setState({ value });
    this.props.onChange(evt, {name, value});
  }

  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }

  componentDidMount() {
    this.setState({ users: databaseController.getUsers() });
  }

  render() {
    const userOptions = this.state.users.map(user => (
      {
        text: user.name,
        value: user.id,
      }));
    return (
      <Form.Select 
        name="user" 
        fluid search selection
        label="Pick a user from the dropdown, or type their name"
        placeholder="Select a user..." 
        options={userOptions}
        value={this.state.value} 
        onChange={this.onChange} />
    )
  }
}

class ServicesDropdown extends Component {
  state = {
    value: this.props.value,
    services: [],
  };

  onChange = (evt, {name, value}) => {
    this.setState({ value });
    this.props.onChange(evt, {name, value});
  }

  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }

  componentDidMount() {
    this.setState({ services: databaseController.getServices() });
  }

  render() {
    const serviceOptions = this.state.services.map(service => (
      {
        text: `${service.name} - ${service.cost} hrs`,
        value: service.id,
      }));
    return (
      <Form.Select 
        name="service" 
        fluid search selection
        label="Pick a service, or product, from the dropdown"
        placeholder="Select a service..." 
        options={serviceOptions}
        value={this.state.value} 
        onChange={this.onChange} />
    )
  }
}


export default SendHrsForm;
