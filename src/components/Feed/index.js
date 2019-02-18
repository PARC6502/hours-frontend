import React, { Fragment } from 'react';
import { Feed, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FeedItem from './FeedItem';
// import UserImage from '../UserImage';
import { timeSince } from '../../helpers';

const FeedFromArray = (props) => (
    <Feed id="eventFeed">
        { props.feedItems.map(feedItem => <FeedItem feedItem={feedItem} key={feedItem.id} />) }
    </Feed>
);

const eventLogMapper = {
    'SEND_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { amount: hours, description, source: from, destination: to } = details;
        // const hours = details.amount;
        // const description = details.description || '';
        const toLink = <Link to={`/user/${to.id}`}>{to.name}</Link>;
        const fromLink = <Link to={`/user/${from.id}`}>{from.name}</Link>;
        return {
            id,
            summary: <Fragment>{toLink} recieved {hours} hours from {fromLink}</Fragment>,
            date: timeSince(dateCreated),
            extra: description,
            userId: to.id,
            hours,
            name: toLink,
        };
    },
    'APPROVE_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { amount: hours, destination: requester, source: organisation, requestDescription} = details;
        const contributorLink = <Link to={`/user/${requester.id}`}>{requester.name}</Link>;
        const organisationLink = <Link to={`/organisation/${organisation.id}`}>{organisation.name}</Link>;
        return {
            id,
            summary: <Fragment>Contributed to {organisationLink}</Fragment>,
            date: timeSince(dateCreated),
            extra: requestDescription,
            userId: requester.id,
            hours,
            name: contributorLink,
        };
    },
    'REJECT_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { amount: hours, destination: requester, source: organisation, description} = details;
        const contributorLink = <Link to={`/user/${requester.id}`}>{requester.name}</Link>;
        const organisationLink = <Link to={`/organisation/${organisation.id}`}>{organisation.name}</Link>;
        return {
            id,
            summary: <Fragment>{organisationLink} rejected {contributorLink}'s request for {hours} hours (Rejected)</Fragment>,
            date: timeSince(dateCreated),
            extra: <Fragment>Reason given for rejecting this request: <strong>{description}</strong></Fragment>,
            userId: requester.id,
        };
    },
    'REQUEST_TOKENS': eventItem => {
        const { docId: id, details, dateCreated } = eventItem;
        const { source: organisation, description, destination: requester, amount: loggedHours } = details;
        const hours = loggedHours;
        const contributorLink = <Link to={`/user/${requester.id}`}>{requester.name}</Link>
        const organisationLink = <Link to={`/organisation/${organisation.id}`}>{organisation.name}</Link>
        return {
            id,
            summary: <Fragment>{contributorLink} logged {hours} hours with {organisationLink} (Pending approval)</Fragment>,
            date: timeSince(dateCreated),
            extra: description,
            userId: requester.id,
        };
    },
}

const MySegment = styled(Segment)`
    min-height: 150px;
`

const MyFeed = props => {
    const feedItems = props.events
    .filter(event => event.type === 'APPROVE_TOKENS' || event.type === 'SEND_TOKENS' )
    .map(event => eventLogMapper[event.type](event));
    return (
            <MySegment basic>
                <Dimmer active={props.loading}>
                    <Loader content="loading" />
                </Dimmer>
                <FeedFromArray feedItems={feedItems} />
            </MySegment>
        
    );
}

MyFeed.propTypes = {
    loading: PropTypes.bool.isRequired,
    events: PropTypes.array.isRequired,
}

export default MyFeed;