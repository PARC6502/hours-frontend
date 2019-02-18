import React, { Component } from 'react';

import Feed from './Feed';
import { db } from '../firebase';


class PersonalFeed extends Component {
    state = {
        events: [],
        loading: true
    }

    componentDidMount() {
        db.getEventLogForUser(this.props.userId)
        .then(events => events.filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'SEND_TOKENS' || event.type === 'REQUEST_TOKENS'))
        .then(events => {
            // feedItems = events.map(event => eventLogMapper[event.type](event))
            this.setState({ events })
        })
        .catch(console.error)
        .then(() => this.setState({ loading: false }));
    }

    render() {
        return (
            <Feed loading={this.state.loading} events={this.state.events} />
        );
    }
}

export default PersonalFeed