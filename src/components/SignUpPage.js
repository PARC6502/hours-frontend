import React, { Component } from 'react';
import { Form, Popup, Message, Divider } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
 


import ImageField from './Form/ImageField';
import ValidatingInput from './Form/ValidatingInput';
import { auth, db, storage } from '../firebase';
// import withAuthorization from './Session/withAuthorization';
import * as routes from '../constants/routes';

const INITIAL_STATE = {
  name: '',
  email: '',
  bio: '',
  image: '',
  password: '',
  confirmPassword: '',
  error: null,
  loading: false,
}

class SignUpFormBase extends Component {

  state = {
    ...INITIAL_STATE
  }

  handleChange = (_e, { name, value }) => {  
    this.setState({ [name]: value });
  }

  isValid = () =>
    this.state.email.length 
    && this.state.password.length >= 6 
    && this.state.password === this.state.confirmPassword

  onSubmit = event => {
    event.preventDefault();

    if (!this.isValid) return;
    this.setState({ loading: true });
    const { email, password, name, bio } = this.state;
    let userId;
    auth.doCreateUserWithEmailAndPassword(email, password)
    .then(signUpResult => {
      userId = signUpResult.user.uid;
      return db.createUser(userId, name, email, bio);
    })
    .then(() => this.state.image ? storage.uploadUserImage(userId, this.state.image) : null )
    .then(image => {
      if (image !== null) return db.editUserImage(userId, image);
      return 
    })
    .then(() => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(routes.HOME_PAGE);
    })
    .catch(error => {
      this.setState({ error });
      console.log(error);
    })
    .then(() => this.setState({ loading: false }))
  }

  passwordValidator = value => {
    return value.length > 5 ? false : "The password you entered is less than 5 characters";
  }

  confirmPasswordValidator = value => {
    return value === this.state.password ? false : "The passwords don't match";
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
          required 
          />
        <Form.Input
          name="email" 
          label="Email"
          placeholder="example@gmail.com" 
          value={this.state.email}
          onChange={this.handleChange}
          required 
          />
        <Popup
          trigger={<ValidatingInput
            name="password" 
            label="Password" 
            type="password" 
            value={this.state.password}
            onChange={this.handleChange}
            validate={this.passwordValidator}
            required />
          } 
          content="Password must be greater than 6 characters"
          on="focus"
          position="right center" />
        <ValidatingInput 
          name="confirmPassword"
          label="Confirm Password" 
          type="password" 
          value={this.state.confirmPassword} 
          onChange={this.handleChange} 
          validate={this.confirmPasswordValidator}
          required 
          />
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

        <Form.Button 
          primary fluid 
          type='submit' 
          loading={this.state.loading} disabled={!this.isValid()}>Sign Up</Form.Button>
      </Form>
    );
  }
}

const SignUpForm = withRouter(SignUpFormBase)

const SignUpPage = () => 
  <>
    <SignUpForm />
    <Divider horizontal>Or</Divider>
    <NavLink className='ui fluid green button' to={routes.SIGN_IN}>Already have an account? Sign In</NavLink>
  </>

export default SignUpPage;