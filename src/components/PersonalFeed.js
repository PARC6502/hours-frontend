import React, { Component, Fragment } from 'react';
import { Feed, Segment, Dimmer, Loader, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { timeSince } from '../helpers'
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
            <Grid centered stackable id="eventFeedContainer">
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

export default PersonalFeed