import React, { Component } from 'react';
import { Feed, Segment, Dimmer, Loader, Image, Grid } from 'semantic-ui-react';

import { eventLogMapper } from '../helpers'
import { db } from '../firebase';

import jennySmall from '../jennySmall.jpg';
import elliotSmall from '../elliotSmall.jpg';
import helenSmall from '../helenSmall.jpg';
import joeSmall from '../joeSmall.jpg';

const imageArray = [jennySmall, elliotSmall, helenSmall, joeSmall]

const FeedFromArray = (props) => (
    <Feed id="eventFeed">
        {props.feedItems.map(feedItem =>
        <Feed.Event key={feedItem.id}>
            <Feed.Label className='middle aligned'><Image src={imageArray[Math.floor(Math.random() * imageArray.length)]} verticalAlign='middle' /></Feed.Label>
            <Feed.Content>
                <Segment className="feed item" raised>
                    <Feed.Summary>
                        {feedItem.summary}
                        <Feed.Date>{feedItem.date} ago</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                        {feedItem.extra}
                    </Feed.Extra>
                </Segment>
            </Feed.Content>
        </Feed.Event>)
        }
    </Feed>
);

class OrganisationFeed extends Component {
    state = {
        feedItems: [],
        loading: true
    }

    componentDidMount() {
        let feedItems = [];
        db.getEventLogForOrganisation(this.props.orgId)
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
                    <Dimmer active={this.state.loading}>
                        <Loader content="loading" />
                    </Dimmer>
                    <FeedFromArray feedItems={feedItems} />
                </Grid.Column>
            </Grid>
        );
    }
}

export default OrganisationFeed
