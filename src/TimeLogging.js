import React, { Component } from 'react';
import './TimeLogging.css';
import { Form, Button } from 'semantic-ui-react';

class TimeLogging extends Component {
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
      task: '',
      project: '',
      time: '',
    };
    this.setState({ fields });
  };

  onFormChange = evt => {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
        <Form.Input
          name="task" 
          label="What did you do?" 
          type="text" 
          value={this.state.fields.task}
          onChange={this.onFormChange} />
        <Form.Input 
          name="project"
          label="What project did you do this for?" 
          type="text" 
          value={this.state.fields.project}
          onChange={this.onFormChange} />
        <Form.Input 
          name="time" 
          label="How long did you spend on this?" 
          type="text"
          value={this.state.fields.time}
          onChange={this.onFormChange} />
        <Button className="ui basic fluid red button">Submit</Button>
      </Form>
    );
  }
}

export default TimeLogging;
