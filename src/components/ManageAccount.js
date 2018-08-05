import React, { Component, Fragment } from 'react';
import { Menu, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'

import { auth } from '../firebase';
import {FirebaseAuthUserContext} from './Session/FirebaseAuthUserProvider';

import * as routes from '../constants/routes';

class ManageAccountForm extends Component {
    state = {
        emailChangeForm: false,
        newEmail: '',
    }

    openEmailChangeForm = () => {
        this.setState({ emailChangeForm: true })
    }
    
    changeEmail = (event) => {
        console.log("changing email...");

        const { history } = this.props;

        auth.doUpdateEmail(this.state.newEmail)
        .then(() => {
            this.setState({ emailChangeForm: false, newEmail: '' });
            history.push(routes.HOME_PAGE);
        });

        event.preventDefault();
    }

    handleChange = (e, { name, value }) => {  
        this.setState({ [name]: value });
        // console.log(this.state);
    }

    render() {
        const { email } = this.props;

        return (
            <Fragment>
                <Menu compact>
                    <Menu.Item header>{ email }</Menu.Item>
                    <Menu.Item onClick={this.openEmailChangeForm}>Change email</Menu.Item>
                </Menu>
                { this.state.emailChangeForm 
                  ? <EmailChangeForm 
                        email={this.state.newEmail} 
                        onSubmit={this.changeEmail} 
                        onChange={this.handleChange} />
                  : null } 
            </Fragment>
        );
    }
}

const EmailChangeForm = (props) => {
    // need to build in login to the change email form
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Group>
                <Form.Input 
                    placeholder="Enter your new email" 
                    name='newEmail' 
                    onChange={props.onChange}
                    value={props.email} />
                <Form.Button type='submit' content='Submit' />
            </Form.Group>
        </Form>
    );
}

const ManageAccount = () => 
    <FirebaseAuthUserContext.Consumer>
        {({ email }) => 
            <ManageAccountForm email={email}/>        
        }
    </FirebaseAuthUserContext.Consumer>

export default withRouter(ManageAccount);