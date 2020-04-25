import React, { Component, Fragment } from 'react';
import { Form, Button, Popup, Message, Divider, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import ImageUpload from './Forms/ImageUpload';

import { auth, db } from '../firebase';
import withAuthorization from './Session/withAuthorization';
import * as routes from '../constants/routes';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  photo: null,
  user: null,
  profileError: null,
  passwordError: null,
  profileSuccess: false,
  passwordSuccess: false,
  profileUpdating: false,
  passwordUpdating: false,
}

class ProfileEditForm extends Component {

  state = {
    ...INITIAL_STATE
  }

  componentDidMount() {
    db.getUser(auth.getCurrentUserId())
      .then( ( user ) => this.setState( {
        user,
        name: user.name,
        email: user.email,
        photo: user.photo,
      } ) );
  }

  handleChange = ( e, { name, value } ) => {
    this.setState( {
      profileSuccess: false,
      passwordSuccess: false,
      profileError: false,
      passwordError: false,
      [ name ]: value
    } );
  }

  isProfileValid = () =>
    !this.state.profileUpdating
    && this.state.user
    && (
      this.state.email !== this.state.user.email
      || this.state.name !== this.state.user.name
    )

  isPasswordValid = () =>
    this.state.password.length >= 6
    && this.state.password === this.state.confirmPassword

  onUpdateProfile = event => {
    event.preventDefault();

    const { email, name } = this.state;

    this.setState( { profileUpdating: true } );

    Promise.all([
      auth.doUpdateProfile({ name }),
      auth.doUpdateEmail(email)
    ])
      .then( () => {
        this.setState( {
          profileUpdating: false,
          profileSuccess: true,
          profileError: false,
        } );
        console.log( "Profile successfully updated!" )
      })
      .catch(error => {
        this.setState( {
          profileError: error,
          profileUpdating: false,
          profileSuccess: false,
          email: this.state.user.email,
          name: this.state.user.name,
        } );
        console.log(error);
      })
  }

  onUploadPhoto = photo => {
    this.setState({ photo });
    auth.doUpdateProfile( { photo } )
      .catch(error => {
        console.log(error);
      });
  }

  onUpdatePassword = event => {
    event.preventDefault();

    if ( !this.isPasswordValid() ) return;

    auth.doUpdatePassword(this.state.password)
      .then(() => {
        console.log( "Password successfully updated!" )
        this.setState( {
          password: '',
          confirmPassword: '',
        })
      })
      .catch(error => {
        this.setState({ passwordError: error });
        console.log(error);
      })
  }

  render() {
    return (
      <Fragment>
        <Header as="h1">
          Edit Profile
          <NavLink to={ routes.PROFILE }>
            <Button floated="right" secondary>Return to profile</Button>
          </NavLink>
        </Header>
        <Form
          onSubmit={ this.onUpdateProfile }
          error={ this.state.profileError }
          success={ this.state.profileSuccess }
        >
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

          { this.state.profileError && (
            <Message
              error
              header="There was a problem:"
              content={ this.state.profileError.message }
            />
          ) }
          { this.state.profileSuccess && (
            <Message
              success
              content="Profile updated!"
            />
          ) }

          <Form.Button primary color="green" fluid disabled={!this.isProfileValid()} type='submit'>Update Profile</Form.Button>
        </Form>
        <Divider hidden />
        <div>
          <Header as="h2">Upload Profile Photo</Header>
          <ImageUpload
            prefix="profile"
            filename={ auth.getCurrentUserId() }
            onUpload={ this.onUploadPhoto }
            image={ this.state.photo }
          />
        </div>
        <Divider hidden />
        <Form
          onSubmit={ this.onUpdatePassword }
          error={ this.state.passwordError }
          success={ this.state.passwordSuccess }
        >
          <Header as="h2">Change Password</Header>
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

          { this.state.passwordError && (
            <Message
              error
              header="Form Error"
              content={ this.state.passwordError.message } />
          ) }

          <Form.Button primary fluid disabled={!this.isPasswordValid()} type='submit'>Update Password</Form.Button>
        </Form>
      </Fragment>
    );
  }
}

const ProfileEditPage = (props) =>
  <Fragment>
    <ProfileEditForm {...props} />
  </Fragment>

const authCondition = (user) => user.id !== null;
export default withAuthorization(authCondition)(ProfileEditPage);
