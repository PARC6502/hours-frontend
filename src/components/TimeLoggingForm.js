import React, { Component } from "react";
import "./TimeLoggingForm.css";
import { Form, Button, Message, List } from "semantic-ui-react";
import ImageUpload from './Forms/ImageUpload';

import { db } from "../firebase";
import { token } from "../firebase";
import { FirebaseAuthUserContext } from "./Session/FirebaseAuthUserProvider";
import withAuthorization from "./Session/withAuthorization";

const INITIAL_FIELDS = {
  task: "",
  orgIndex: "",
  time: "",
  meals: "",
  photo: "",
  dateOfLabour: "",
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
      isUploading: false,
      uploadError: false,
    };
  }

  componentDidMount() {
    db.getOrganisations().then(organisations => {
      this.setState({
        organisations,
        loading: false
      });
    });
  }

  handleSubmit = () => {
    this.setState({ submitting: true });
    this.logHours()
      .then(() =>
        this.setState({ success: true, fields: { ...INITIAL_FIELDS } })
      )
      .catch(error => this.setState({ error }))
      .then(() => this.setState({ submitting: false }));
  };

  logHours = () => {
    var { task, orgIndex, time, meals, dateOfLabour, photo = '' } = this.state.fields;
    const org = this.state.organisations[ orgIndex ];

    return token.requestTokens(org, this.props.user, {
      loggedHours: time,
      mealsProvided: meals,
      description: task,
      photo,
      dateOfLabour
    });
  };

  onFormChange = (evt, { name, value }) => {
    const fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };

  validateTime = time => {
    const hours = Number(time);
    return hours > 0 && hours < 1500;
  };

  validateDate = dateString => {
    const MILLIS_IN_MONTH = 2678400000;
    const loggedDate = new Date(dateString);
    const today = new Date();
    const dateDiff = today - loggedDate;
    // check
    const dateNotInFuture = dateDiff >= 0;
    const dateLessThanMonthOld = dateDiff < MILLIS_IN_MONTH;
    return dateLessThanMonthOld && dateNotInFuture;
  };

  validate = () => {
    const isSome = x => x !== null && x !== "";
    const fields = { ...this.state.fields };
    // Remove optional fields.
    delete fields.photo;
    const fieldValues = Object.values(fields);
    const fieldValuesAreSome = fieldValues.every(isSome);
    const timeFieldValid = this.validateTime(fields.time);
    const dateFieldValid = this.validateDate(fields.dateOfLabour);
    return fieldValuesAreSome && timeFieldValid && dateFieldValid;
  };

  render() {
    const orgOptions = this.state.organisations.map((org, i) => ({
      text: org.name,
      value: i
    }));

    return (
      <Form
        onSubmit={this.handleSubmit}
        loading={this.state.loading}
        error={this.state.error}
        success={this.state.success}
      >
        <Message>
          <Message.Header>How to post impact</Message.Header>
          <List bulleted>
            <List.Item>You need to fill in all of the fields</List.Item>
            <List.Item>
              You need to list how you helped people, and how many you helped{" "}
            </List.Item>
            <List.Item>You can't post tasks over a month old</List.Item>
          </List>
        </Message>
        <Form.Input
          name="task"
          label="How did you help people?"
          placeholder=" Example: Isolation food parcels, Collected shopping"
          type="text"
          value={this.state.fields.task}
          onChange={this.onFormChange}
        />
        <Form.Select
          name="orgIndex"
          fluid
          search
          selection
          label="What voluntary org or group are you a part of?"
          placeholder="Select a project..."
          options={orgOptions}
          value={this.state.fields.orgIndex}
          onChange={this.onFormChange}
        />
        <p>
          Not there?
          { " " }
          <a href="https://forms.gle/KXQPG6gcuQsPSFXdA"> Add your group.</a>
        </p>
        <Form.Input
          name="time"
          label="How many people did you help?"
          type="number"
          value={this.state.fields.time}
          onChange={this.onFormChange}
        />
        <Form.Input
          name="meals"
          label="How many meals did you provide?"
          type="number"
          value={this.state.fields.meals}
          onChange={this.onFormChange}
        />
        <Form.Input
          name="dateOfLabour"
          label="When did you do this?"
          type="date"
          value={this.state.fields.dateOfLabour}
          onChange={this.onFormChange}
        />
        <ImageUpload
          label="Upload a photo (optional)"
          onUpload={ photo => this.setState( { isUploading: false, fields: { ...this.state.fields, photo } } ) }
          prefix="log"
          image={ this.state.fields.photo }
          onStart={ () => this.setState({ isUploading: true, uploadError: false }) }
          onError={ error => this.setState({ isUploading: false, uploadError: error }) }
        />
        <Message
          error
          header="Form Error"
          content={this.state.error ? this.state.error.message : ""}
        />
        <Message
          success
          header="Success!"
          content="You have successfully logged your impact!"
        />
        <Button
          fluid
          basic
          color="green"
          disabled={!this.validate() || this.state.isUploading}
          loading={this.state.submitting}
        >
          Submit Request
        </Button>
      </Form>
    );
  }
}

const TimeLoggingFormWithUser = () => (
  <FirebaseAuthUserContext.Consumer>
    {user => <TimeLoggingForm user={user} />}
  </FirebaseAuthUserContext.Consumer>
);

const authCondition = user => user !== null;
export default withAuthorization(authCondition)(TimeLoggingFormWithUser);
