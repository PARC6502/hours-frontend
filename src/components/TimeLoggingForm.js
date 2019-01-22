import React, { Component } from 'react';
import './TimeLoggingForm.css';
import { Form, Button, Message, List } from 'semantic-ui-react';

import { db } from '../firebase';
import { token } from '../firebase';
import {FirebaseAuthUserContext} from './Session/FirebaseAuthUserProvider';
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
    
    return token.requestTokens({
      fromOrg: org, 
      requester: this.props.user, 
      description: task,
      dateOfLabour,
      loggedHours: time,
    });
  }

  onFormChange = (evt, {name, value}) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  validateTime = (time) => {
    const hours = Number(time);
    return hours > 0
    && hours < 24
  }

  validateDate = (dateString) => {
    const MILLIS_IN_MONTH = 2678400000;
    const loggedDate = new Date(dateString);
    const today = new Date();
    const dateDiff = today - loggedDate;
    // check 
    const dateNotInFuture = dateDiff >= 0;
    const dateLessThanMonthOld = dateDiff < MILLIS_IN_MONTH; 
    return dateLessThanMonthOld && dateNotInFuture;
  }

  validate = () => {
    const isSome = x => x !== null && x !== '';
    const fields = this.state.fields;
    const fieldValues = Object.values(fields);
    const fieldValuesAreSome = fieldValues.every(isSome);
    const timeFieldValid = this.validateTime(fields.time);
    const dateFieldValid = this.validateDate(fields.dateOfLabour);
    return fieldValuesAreSome && timeFieldValid && dateFieldValid;
  }

  render() {
    const orgOptions = this.state.organisations.map((org, i) => (
      {
        text: org.name,
        value: i,
      }));
    
    return (
      <Form onSubmit={this.handleSubmit} loading={this.state.loading} 
      error={this.state.error} success={this.state.success}>
        <Message>
          <Message.Header>How to log hours</Message.Header>
          <List bulleted>
            <List.Item>You need to fill in all of the fields</List.Item>
            <List.Item>You can only log a maximum of 24 hours at once</List.Item>
            <List.Item>You can't log tasks over a month old</List.Item>
          </List>
        </Message>
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
          label="How many hours did you spend on this?" 
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
          fluid basic
          color='green'
          disabled={!this.validate()}
          loading={this.state.submitting}>Submit Request</Button>
      </Form>
    );
  }
}

const TimeLoggingFormWithUser = () =>
  <FirebaseAuthUserContext.Consumer>
    {user => <TimeLoggingForm user={user} />}
  </FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(TimeLoggingFormWithUser);