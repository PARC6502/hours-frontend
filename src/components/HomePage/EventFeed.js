import React, { Component } from 'react';

import Feed from '../Feed';
import { db } from '../../firebase';




class EventFeed extends Component {
    state = {
        events: [],
        loading: true
    }

    componentDidMount() {
        db.getEventLog()
        .then(events => events.filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'REJECT_TOKENS' || event.type === 'SEND_TOKENS' || event.type === 'REQUEST_TOKENS'))
        .then(events => {
            // console.log(events);
            this.setState({ events });
            return events;
        })
        .catch(console.error)
        .then(() => {
            // console.log(feedItems);
            this.setState({ loading: false })
        });
    }

    render() {
        return (
            <Feed events={this.state.events} loading={this.state.loading} />
        );
    }
}

export default EventFeed