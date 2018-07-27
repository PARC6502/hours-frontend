import React, { Component } from 'react';
import { Form, Message, Segment } from 'semantic-ui-react';

import { admin, firebase } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';

class ManageRequests extends Component {
    state = {
        error: null,
        success: null,
        loading: false,
        requests: [],
    }

    componentDidMount() {
        // some db function to get requests
        firebase.db.collection('token-requests').get()
        .then(querySnapshot => querySnapshot.docs)
        .then(docs => docs.map( doc => ({ docId: doc.id,  ...doc.data() })) )
        .then(console.log);
        // .then(requests => this.setState({ requests }))
        // .then(querySnapshot => {
        //     querySnapshot.forEach(doc => {
                
        //     });
        // })
    }
    
    onSubmit = e => {
        e.preventDefault();
        // console.log(this.state);
        const { name, description } = this.state;
        admin.createOrganisation(name,description)
        .then(success => {
            this.setState({
                name: '',
                description: '',
                success: 'Organisation created successfully!'
            })
        })
        .catch(error => this.setState({ error }))
    }

    handleChange = (e, { name, value }) => {  
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Segment.Group>

            </Segment.Group> 
        );  
    }
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(ManageRequests);