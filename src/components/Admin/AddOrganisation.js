import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

import { admin } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';

class AddOrganisation extends Component {
    state = {
        name: '',
        description: '',
        error: null
    }
    
    onSubmit = e => {
        e.preventDefault();

        console.log(this.state);
    }

    handleChange = (e, { name, value }) => {  
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={this.state.error !== null}>
                <Form.Input name='name' value={this.state.name} placeholder='Organisation name' onChange={this.handleChange}/>
                <Form.TextArea name='description' value={this.state.description} placeholder='Description' onChange={this.handleChange} />
                <Form.Button type='submit'>Submit</Form.Button>
                <Message
                    error
                    header="Form Error"
                    content={this.state.error ? this.state.error.message : ''} />
            </Form>
        );  
    }
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(AddOrganisation);