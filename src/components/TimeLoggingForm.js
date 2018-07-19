import React, { Component } from 'react';
import './TimeLoggingForm.css';
import { Form, Button } from 'semantic-ui-react';

import { auth, db } from '../firebase';

class TimeLoggingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        task: '',
        project: '',
        time: '',
      },
      organisations: [],
      loading: true
    };
    db.getOrganisations()
    .then(organisations => {
      console.log(organisations);
      this.setState({
        organisations,
        loading: false,
      })
    })
  }
  

  handleSubmit = () => {
    console.log("form submitted");
    console.log(this.state.fields);
    this.logHours();
    const fields = {
      task: '',
      project: '',
      time: '',
    };
    this.setState({ fields });
  };

  logHours = () => {
    const userId = auth.getCurrentUserId();
    console.log('userId: ' + userId)
    var { task, project, time } = this.state.fields;

    db.sendHoursToUser(userId, time)
    .then(() => db.generateHoursFromOrg(project, time))
    .then(() => db.createTransaction("Log Hours", project, userId, time, task))
    .catch((error) => console.log(error));
  }

  onFormChange = (evt, {name, value}) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  render() {
    const orgOptions = this.state.organisations.map(org => (
      {
        text: org.name,
        value: org.id,
      }));
    
    return (
      <Form onSubmit={this.handleSubmit} loading={this.state.loading}>
        <Form.Input
          name="task" 
          label="What did you do?" 
          type="text" 
          value={this.state.fields.task}
          onChange={this.onFormChange} />
        <Form.Select 
          name="project" 
          fluid search selection
          label="Who did you do this for?"
          placeholder="Select a project..." 
          options={orgOptions}
          value={this.state.fields.project} 
          onChange={this.onFormChange} />
        <Form.Input 
          name="time" 
          label="How long did you spend on this?" 
          type="number"
          value={this.state.fields.time}
          onChange={this.onFormChange} />
        <Button className="ui basic fluid red button">Submit</Button>
      </Form>
    );
  }
}

export default TimeLoggingForm;
