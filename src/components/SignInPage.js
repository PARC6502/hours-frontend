import React, { Fragment, Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import withAuthorization from './Session/withAuthorization';
import * as routes from '../constants/routes';

class SignInForm extends Component {

  state = {
    email: '',
    password: '',
    error: null,
  }

  handleChange = (e, { name, value }) => {  
    this.setState({ [name]: value });
  }

  validate = () =>
    this.state.email.length 
    && this.state.password.length

  render() {
    return (
      <Form>
        <Form.Input
          name="email" 
          label="Email"
          placeholder="example@gmail.com" 
          value={this.state.email}
          onChange={this.handleChange} 
          />
        <Form.Input
          name="password" 
          label="Password" 
          type="password" 
          value={this.state.password}
          onChange={this.handleChange} />
        <Form.Button primary fluid disabled={!this.validate()}>Sign Up</Form.Button>
        <Button as={NavLink} to={routes.SIGN_UP} fluid>Don't have an account? Sign Up</Button>

      </Form>
    );
  }
}

const SignInPage = () => 
  <Fragment>
    <SignInForm />
  </Fragment>

const authCondition = (userId) => userId === null;
export default withAuthorization(authCondition)(SignInPage);