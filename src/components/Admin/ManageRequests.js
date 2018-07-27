import React, { Component, Fragment } from 'react';
import { Segment, Button, Icon, Header } from 'semantic-ui-react';

import { admin, token } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';

class ManageRequests extends Component {
    state = {
        error: null,
        success: null,
        loading: false,
        reqs: [],
    }

    componentDidMount() {
       this.loadRequests();
    }

    loadRequests() {
        token.getRequests()
        .then(reqs => this.setState({ reqs }));
    }
    
    onSubmit = e => {
        e.preventDefault();
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

    handleAccept = (req) => {
        token.approveTokens(req.docId, req.fromId)
        .then(() => this.loadRequests())
        .catch(console.error)
    }

    handleReject = (req) => {
        token.rejectTokens(req, req.fromId, 'Unspecified')
        .then(() => this.loadRequests())
        .catch(console.error)
    }

    render() {
        const renderReqPending = (req) =>
            <Segment vertical fluid key={req.docId}>
                <Icon name='wait' />
                {`${req.requesterName} requested ${req.tokens} hours for "${req.description}" done on ${req.dateOfLabour}`}
                <Button.Group floated='right'>
                    <Button primary onClick={() => this.handleAccept(req)}>Accept</Button>
                    <Button red onClick={() => this.handleReject(req)}>Reject</Button>
                </Button.Group>
            </Segment>

        const renderReqFulfilled = (req) =>
            <Segment vertical fluid key={req.docId}>
                <Icon name={ req.approved ? 'check' : 'ban'} />
                {`${req.requesterName} requested ${req.tokens} hours for "${req.description}" done on ${req.dateOfLabour}`}
            </Segment> 
        
        const reqs = this.state.reqs
        const reqsPending = reqs.filter(req => !req.fulfilled);
        const reqsFulfilled = reqs.filter(req => req.fulfilled);
        return (
            <Fragment>
                <Header>Pending</Header>
                {reqsPending.map(renderReqPending)}

                <Header>Fulfilled</Header>
                {reqsFulfilled.map(renderReqFulfilled)}
            </Fragment>
        );
    }
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(ManageRequests);