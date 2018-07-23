import React, { Fragment, Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import withAuthorization from './Session/withAuthorization';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

class SignInForm extends Component {

  state = {
    ...INITIAL_STATE
  }

  handleChange = (e, { name, value }) => {  
    this.setState({ [name]: value });
  }

  validate = () =>
    this.state.email.length 
    && this.state.password.length

  onSubmit = (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    auth.doSignInWithEmailAndPassword(email, password)
    .then(() => this.setState({...INITIAL_STATE}))
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
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
        <Form.Button primary fluid disabled={!this.validate()}>Sign In</Form.Button>
        <Button as={NavLink} to={routes.SIGN_UP} fluid>Don't have an account? Sign Up</Button>

      </Form>
    );
  }
}

const SignInPage = () => 
  <Fragment>
    <SignInForm />
  </Fragment>

const authCondition = (user) => user.id === null;
export default withAuthorization(authCondition)(SignInPage);