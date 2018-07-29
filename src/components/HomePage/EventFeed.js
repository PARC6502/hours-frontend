import React, { Component } from 'react';
import { Feed, Segment, Dimmer, Loader, Image, Grid } from 'semantic-ui-react';

import { timeSince } from '../../helpers'
import { db } from '../../firebase';

import jennySmall from '../../jennySmall.jpg';
import elliotSmall from '../../elliotSmall.jpg';
import helenSmall from '../../helenSmall.jpg';
import joeSmall from '../../joeSmall.jpg';
import './EventFeed.css';

const dummyFeed = [
    {
        id: 0,
        summary: ` recieved  hours from `,
        extra: 'description',
        fromId: 'from',
        toId: 'to',
    }
];

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

const eventLogMapper = {
    'SEND_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const toName = details.to.name;
        const fromName = details.from.name;
        const hours = details.amount;
        return {
            id,
            summary: `${toName} recieved ${hours} hours from ${fromName}`,
            date: timeSince(dateCreated),
            extra: '',
        };
    },
    'APPROVE_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const contributor = details.requesterName;
        const organisation = details.fromName;
        const hours = details.tokens;
        const description = details.description;
        return {
            id,
            summary: `${contributor} contributed ${hours} hours to ${organisation} (Approved)`,
            date: timeSince(dateCreated),
            extra: description,
        };
    },
    'REQUEST_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const contributor = details.requester.name;
        const organisation = details.fromOrg.name;
        const hours = details.loggedHours;
        const description = details.description;
       
        return {
            id,
            summary: `${contributor} logged ${hours} hours with ${organisation} (Pending approval)`,
            date: timeSince(dateCreated),
            extra: description,
        };
    },
}

class EventFeed extends Component {
    state = {
        feedItems: null,
        loading: true
    }

    componentDidMount() {
        let feedItems = [];
        db.getEventLog()
        .then(events => events.filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'SEND_TOKENS' || event.type === 'REQUEST_TOKENS'))
        .then(events => {
            feedItems = events.map(event => eventLogMapper[event.type](event))
            console.log(feedItems);
            this.setState({ feedItems })
        })
        .catch(console.error)
        .then(() => this.setState({ loading: false }));
    }

    render() {
        const feedItems = this.state.feedItems || dummyFeed;
        return (
            <Grid centered columns={2} id="eventFeedContainer">
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

export default EventFeed