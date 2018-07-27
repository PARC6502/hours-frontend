import React, { Component } from 'react';
import './TimeLoggingForm.css';
import { Form, Button, Message } from 'semantic-ui-react';

import { db } from '../firebase';
import { token } from '../firebase';
import AuthUserContext from './Session/AuthUserContext'
import withAuthorization from './Session/withAuthorization';

const INITIAL_FIELDS = {
  task: '',
  orgIndex: '',
  time: '',
  dateOfLabour: null,
};

class TimeLoggingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        ...INITIAL_FIELDS
      },
      organisations: [],
      loading: true,
      submitting: false,
      error: null,
      success: false,
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
    this.setState({ submitting: true });
    this.logHours()
    .then(() => this.setState({ success:true, fields: {...INITIAL_FIELDS} }))
    .catch((error) => this.setState({ error }))
    .then(() => this.setState({ submitting: false }));
  };

  logHours = () => {
    var { task, orgIndex, time, dateOfLabour } = this.state.fields;
    const org = this.state.organisations[orgIndex];
    
    return token.requestTokens(org, this.props.user, {loggedHours: time, description: task, dateOfLabour});
  }

  onFormChange = (evt, {name, value}) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  render() {
    const orgOptions = this.state.organisations.map((org, i) => (
      {
        text: org.name,
        value: i,
      }));
    
    return (
      <Form onSubmit={this.handleSubmit} loading={this.state.loading} 
      error={this.state.error} success={this.state.success}>
        <Form.Input
          name="task" 
          label="What did you do?" 
          type="text" 
          value={this.state.fields.task}
          onChange={this.onFormChange} />
        <Form.Select 
          name="orgIndex" 
          fluid search selection
          label="Who did you do this for?"
          placeholder="Select a project..." 
          options={orgOptions}
          value={this.state.fields.orgIndex} 
          onChange={this.onFormChange} />
        <Form.Input 
          name="time" 
          label="How long did you spend on this?" 
          type="number"
          value={this.state.fields.time}
          onChange={this.onFormChange} />
          <Form.Input 
            name="dateOfLabour" 
            label="When did you do this?" 
            type="date"
            value={this.state.fields.dateOfLabour}
            onChange={this.onFormChange} />
          <Message
            error
            header="Form Error"
            content={this.state.error ? this.state.error.message : ''} />
          <Message
            success
            header="Success!"
            content='You have successfully requested hours tokens!' />
        <Button 
          className="ui basic fluid red button" 
          loading={this.state.submitting}>Submit Request</Button>
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