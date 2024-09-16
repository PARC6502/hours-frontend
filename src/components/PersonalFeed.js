import React, { Component } from 'react';
import { Dimmer, Loader, Grid } from 'semantic-ui-react';

import ActivityFeed from './ActivityFeed';

import { eventLogMapper } from '../helpers'
import { db } from '../firebase';


class PersonalFeed extends Component {
    state = {
        feedItems: [],
        loading: true
    }

    componentDidMount() {
        let feedItems = [];
        db.getEventLogForUser(this.props.userId)
        .then(events => events.filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'SEND_TOKENS' || event.type === 'REQUEST_TOKENS'))
        .then(events => {
            feedItems = events.map(event => eventLogMapper[event.type](event))
            this.setState({ feedItems })
        })
        .catch(console.error)
        .then(() => this.setState({ loading: false }));
    }

    render() {
        const feedItems = this.state.feedItems;
        return (
            <Grid centered container columns={2} stackable id="eventFeedContainer">
                <Grid.Column>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader inverted content="loading" />
                    </Dimmer>
                    <ActivityFeed items={feedItems} />
                </Grid.Column>
            </Grid>
        );
    }
}

export default PersonalFeed
