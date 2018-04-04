import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';

class SendHrsForm extends Component {
  state = {
    fields: {
      task: '',
      project: '',
      time: '',
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

  onFormChange = evt => {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  };

  availableServicesOptions = [
    {
      text: "One day Cowork Space Use - 3 hrs",
      value: "foodhallCowork",
    },
    {
      text: "Selection of herbs from Garden - 1 hrs",
      value: "gardenHerbs",
    },
    {
      text: "TNK Rave - 3hrs",
      value: "tnkRave",
    },
  ];

  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
        <Form.Select
          name="service" 
          fluid
          label="Pick the service you want to spend hrs on" 
          options={this.availableServicesOptions} 
          placeholder="Pick a service from the dropdown"
          value={this.state.fields.service}
          onChange={this.onFormChange} />
        <Button className="ui basic fluid red button">Send Hrs</Button>
      </Form>
    );
  }
}

export default SendHrsForm;
