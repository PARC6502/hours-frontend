import React, { Component, Fragment } from 'react';
import { Form, Popup, Message, Divider } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import ImageField from './Form/ImageField';
import { auth, db, storage } from '../firebase';
import withAuthorization from './Session/withAuthorization';
import * as routes from '../constants/routes';

const INITIAL_STATE = {
  name: '',
  email: '',
  bio: '',
  image: '',
  password: '',
  confirmPassword: '',
  error: null,
}

class SignUpForm extends Component {

  state = {
    ...INITIAL_STATE
  }

  handleChange = (e, { name, value }) => {  
    this.setState({ [name]: value });
  }

  isValid = () =>
    this.state.email.length 
    && this.state.password.length >= 6 
    && this.state.password === this.state.confirmPassword

  onSubmit = event => {
    event.preventDefault();

    if (!this.isValid) return;
    
    const { email, password, name, bio } = this.state;
    let userId;
    auth.doCreateUserWithEmailAndPassword(email, password)
    .then(signUpResult => {
      this.setState({ ...INITIAL_STATE });
      userId = signUpResult.user.uid;
      return db.createUser(userId, name, email, bio)
    })
    .then(() => this.state.image ? storage.uploadUserImage(userId, this.state.image) : null)
    .catch(error => {
      this.setState({ error });
      console.log(error);
    })
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={this.state.error !== null}>
        <Form.Input
          name="name" 
          label="Name" 
          placeholder="Sarah Khan"
          value={this.state.name}
          onChange={this.handleChange} 
          />
        <Form.Input
          name="email" 
          label="Email"
          placeholder="example@gmail.com" 
          value={this.state.email}
          onChange={this.handleChange} 
          />
        <Popup
          trigger={<Form.Input
            name="password" 
            label="Password" 
            type="password" 
            value={this.state.password}
            onChange={this.handleChange} />
          } 
          content="Password must be greater than 6 characters"
          on="focus"
          position="right center" />
        <Form.Input 
          name="confirmPassword"
          label="Confirm Password" 
          type="password" 
          value={this.state.confirmPassword} 
          onChange={this.handleChange} />
        <Form.TextArea 
          label='Edit Bio' 
          value={this.state.bio} 
          name='bio' 
          onChange={this.handleChange}/>
        <ImageField
          label='Profile image' 
          name='image'
          onChange={this.handleChange}
        />
        <Message
          error
          header="Form Error"
          content={this.state.error ? this.state.error.message : ''} />

        <Form.Button primary fluid type='submit' disabled={!this.isValid()}>Sign Up</Form.Button>
      </Form>
    );
  }
}

const SignUpPage = () => 
  <Fragment>
    <SignUpForm />
    <Divider horizontal>Or</Divider>
    <NavLink className='ui fluid green button' to={routes.SIGN_IN}>Already have an account? Sign In</NavLink>
  </Fragment>

const authCondition = (user) => user.id === null;
export default withAuthorization(authCondition)(SignUpPage);