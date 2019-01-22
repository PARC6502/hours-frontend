import React, { Component, Fragment } from 'react';
import { Segment, Button, Icon, Header, Input } from 'semantic-ui-react';

import { admin, token } from '../../firebase';
import withAuthorization from '../Session/withAuthorization';

class ManageRequests extends Component {
    state = {
        error: null,
        success: null,
        loading: false,
        rejectionReason: '',
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

    handleAccept = (req, acceptanceComment) => {
        token.approveTokens(req.docId, req.source.id, acceptanceComment)
        .then(() => this.loadRequests())
        .catch(console.error)
    }

    handleReject = (req, rejectionReason) => {
        token.rejectTokens(req, req.fromId, rejectionReason)
        .then(() => this.loadRequests())
        .catch(console.error)
    }

    render() {
        const renderReqFulfilled = (req) => {
            const {
                docId,
                approved,
                destination: requester,  
                description, 
                amount: hours, 
                dateOfLabour,
                rejectionReason} = req;

            return (<Segment vertical fluid key={docId}>
                <Icon name={ approved ? 'check' : 'ban'} />
                {`${requester.name} requested ${hours} hours for "${description}" done on ${dateOfLabour}`}
                {rejectionReason ? <p>Rejected because: <strong>{rejectionReason}</strong></p> : null}
            </Segment>); 
        }
        
        const reqs = this.state.reqs
        const reqsPending = reqs.filter(req => !req.fulfilled);
        const reqsFulfilled = reqs.filter(req => req.fulfilled);
        return (
            <Fragment>
                <Header>Pending</Header>
                {reqsPending.map(request => <PendingRequest 
                                            request={request} 
                                            handleAccept={this.handleAccept}
                                            handleReject={this.handleReject}    
                                            />)}

                <Header>Fulfilled</Header>
                {reqsFulfilled.map(renderReqFulfilled)}
            </Fragment>
        );
    }
}

class PendingRequest extends Component {
    state = {
        description: '',
    }

    onDescriptionChange = (evt, { value }) => {
        this.setState({ description: value });
    };

    render() {
        const req = this.props.request;
        const {
            destination: requester, 
            source: organisation, 
            description, 
            amount: hours, 
            dateOfLabour} = req;
        
        
        return (<Segment vertical fluid key={req.docId}>
            <Icon name='wait' />
            {`${requester.name} requested ${hours} hours for "${description}" from ${organisation.name} done on ${dateOfLabour}`}

            <Button.Group floated='right'>
                <Button primary onClick={() => this.props.handleAccept(req, this.state.description)}>Accept</Button>
                <Button disabled={this.state.description === ''} red onClick={() => this.props.handleReject(req, this.state.description)}>Reject</Button>
            </Button.Group>
            <Input 
                placeholder='Reason for rejection (required)/Acceptance comment (optional)' 
                fluid
                value={this.state.description}
                onChange={this.onDescriptionChange}
                />
        </Segment>); 
    }
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(ManageRequests);