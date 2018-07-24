import React, { Component } from 'react';
import './TimeLoggingForm.css';
import { Form, Button } from 'semantic-ui-react';

import { db } from '../firebase';
import AuthUserContext from './Session/AuthUserContext'
import withAuthorization from './Session/withAuthorization';

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
  }
  
  componentDidMount() {
    db.getOrganisations()
    .then(organisations => {
      this.setState({
        organisations,
        loading: false,
      })
    })
  }

  handleSubmit = () => {
    this.logHours();
    const fields = {
      task: '',
      project: '',
      time: '',
    };
    this.setState({ fields });
  };

  logHours = () => {
    const { id: userId, name: userName } = this.props.user;
    var { task, project, time } = this.state.fields;
    let [projectId, projectName] = project.split('-');
    console.log(userId, userName, projectName);
    db.logHours(userId, time)
    .then(() => db.updateDistributedHoursForOrg(projectId, time))
    .then(() => db.createTransaction("Log Hours", projectId, projectName, userId, userName, time, task, Date.now()))
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
        value: `${org.id}-${org.name}`,
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

const TimeLoggingFormWithUser = () =>
  <AuthUserContext.Consumer>
    {user => <TimeLoggingForm user={user} />}
  </AuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(TimeLoggingFormWithUser);