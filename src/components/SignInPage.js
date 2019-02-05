import React, { Fragment, Component } from 'react';
import { Form, Divider, Message } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import withAuthorization from './Session/withAuthorization';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

const errors = {
  'auth/user-not-found': "We didn't find a user with this email, maybe you used a different email to signup?",
  'auth/wrong-password': "Seems like the password is wrong! Double check it and try again",
  'auth/invalid-email': "That email isn't valid",
  'auth/user-disabled': "Account disabled",
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
    .catch(error => {
      this.setState({error})
    })
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={this.state.error}>
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
        <Message error>{this.state.error ? errors[this.state.error.code] : ''}</Message>
        <Form.Button color='green' fluid disabled={!this.validate()}>Sign In</Form.Button>
      </Form>
    );
  }
}

const SignInPage = () => 
  <Fragment>
    <SignInForm />
    <Divider horizontal>Or</Divider>
    <NavLink className='ui fluid primary button' to={routes.SIGN_UP}>Don't have an account? Sign Up</NavLink>
  </Fragment>

const authCondition = (user) => user.id === null;
export default withAuthorization(authCondition)(SignInPage);