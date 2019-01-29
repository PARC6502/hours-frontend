import React, { Component, Fragment } from 'react';
import { Feed, Segment, Dimmer, Loader, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { timeSince } from '../../helpers'
import { db } from '../../firebase';


import jennySmall from '../../jennySmall.jpg';
import elliotSmall from '../../elliotSmall.jpg';
import helenSmall from '../../helenSmall.jpg';
import joeSmall from '../../joeSmall.jpg';
import './EventFeed.css';

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
        const { amount: hours, description, source: from, destination: to } = details;
        // const hours = details.amount;
        // const description = details.description || '';
        const toLink = <Link to={`user/${to.id}`}>{to.name}</Link>;
        const fromLink = <Link to={`user/${from.id}`}>{from.name}</Link>;
        return {
            id,
            summary: <Fragment>{toLink} recieved {hours} hours from {fromLink}</Fragment>,
            date: timeSince(dateCreated),
            extra: description,
        };
    },
    'APPROVE_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { amount: hours, destination: requester, source: organisation, requestDescription} = details;
        const contributorLink = <Link to={`user/${requester.id}`}>{requester.name}</Link>;
        const organisationLink = <Link to={`organisation/${organisation.id}`}>{organisation.name}</Link>;
        return {
            id,
            summary: <Fragment>{contributorLink} contributed {hours} hours to {organisationLink} (Approved)</Fragment>,
            date: timeSince(dateCreated),
            extra: requestDescription,
        };
    },
    'REJECT_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { amount: hours, destination: requester, source: organisation, description} = details;
        const contributorLink = <Link to={`user/${requester.id}`}>{requester.name}</Link>;
        const organisationLink = <Link to={`organisation/${organisation.id}`}>{organisation.name}</Link>;
        return {
            id,
            summary: <Fragment>{organisationLink} rejected {contributorLink}'s request for {hours} hours (Rejected)</Fragment>,
            date: timeSince(dateCreated),
            extra: <Fragment>Reason given for rejecting this request: <strong>{description}</strong></Fragment>,
        };
    },
    'REQUEST_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { source: organisation, description, destination: requester, amount: loggedHours } = details;
        const hours = loggedHours;
        const contributorLink = <Link to={`user/${requester.id}`}>{requester.name}</Link>
        const organisationLink = <Link to={`organisation/${organisation.id}`}>{organisation.name}</Link>
        return {
            id,
            summary: <Fragment>{contributorLink} logged {hours} hours with {organisationLink} (Pending approval)</Fragment>,
            date: timeSince(dateCreated),
            extra: description,
        };
    },
}

class EventFeed extends Component {
    state = {
        feedItems: [],
        loading: true
    }

    // shouldComponentUpdate(_nextProps, nextState) {
    //     if (this.state.feedItems.length !== nextState.feedItems.length) return true;
    //     if (this.state.loading !== nextState.loading) return true;
    //     return false;
    // }

    componentDidMount() {
        let feedItems = [];
        db.getEventLog()
        .then(events => events.filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'REJECT_TOKENS' || event.type === 'SEND_TOKENS' || event.type === 'REQUEST_TOKENS'))
        .then(events => {
            // console.log(events);
            return events;
        })
        .then(events => {
            feedItems = events.map(event => eventLogMapper[event.type](event))
        })
        .catch(console.error)
        .then(() => {
            // console.log(feedItems);
            this.setState({ feedItems, loading: false })
        });
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

export default EventFeed