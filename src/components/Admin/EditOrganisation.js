import React, { Component } from 'react';
import { Form, Message, Header, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import ImageUpload from '../Forms/ImageUpload';

import { admin, db } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';
import * as routes from '../../constants/routes';

class EditOrganisation extends Component {
    state = {
        loading: true,
        id: null,
        name: '',
        description: '',
        photo: null,
        error: null,
        success: null,
    }

    componentDidMount() {
		const match = this.props.match;
        db.getOrganisation( match.params.organisationId )
            .then( org => {
                this.setState( {
                    loading: false,
                    id: match.params.organisationId,
                    ...org
                } );
            } )
            .catch( error => {
                this.setState( { error } );
            } );
    }

    onSubmit = e => {
        e.preventDefault();
        console.log(this.state, this.props)

        if ( this.state.loading || !this.state.id ) {
            return;
        }

        const data = {
            name: this.state.name,
            description: this.state.description,
            photo: this.state.photo,
        };

        admin.updateOrganisation(this.state.id, data)
            .then(success => {
                this.setState( {
                    error: null,
                    success: 'Organisation created successfully!'
                })
            })
            .catch(error => this.setState({ error }))
    }

    handleChange = (e, { name, value }) => {
        this.setState({ error: null, success: null, [name]: value });
    }

    render() {
        return (
            <Form onSubmit={ this.onSubmit } error={ this.state.error !== null } success={ this.state.success !== null }>
                <Header as="h1">
                    Edit Organisation
                    <NavLink to={ routes.ADMIN_PAGE }>
                        <Button floated="right" secondary>Return to admin</Button>
                    </NavLink>
                </Header>
                <Form.Input name='name' value={this.state.name} placeholder='Organisation name' onChange={this.handleChange}/>
                <Form.TextArea name='description' value={ this.state.description } placeholder='Description' onChange={ this.handleChange } />
                <ImageUpload
                    prefix="organisation"
                    filename={ this.state.id }
                    onUpload={ photo => this.setState( { photo } ) }
                    image={ this.state.photo }
                />
                <Message
                    error
                    header="Form Error"
                    content={this.state.error ? this.state.error.message : ''} />
                <Message success header='Organisation Updated' content={this.state.success || ''} />
                <Form.Button primary disabled={this.state.loading || !this.state.id} type='submit'>Update Organisation</Form.Button>
            </Form>
        );
    }
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(EditOrganisation);
