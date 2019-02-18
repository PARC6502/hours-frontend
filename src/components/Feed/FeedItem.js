import React from 'react';
import { Feed, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UserImage from '../UserImage';


const FeedItem = props => {
    const feedItem = props.feedItem;
    return (<Feed.Event>
        <Feed.Label className='middle aligned'><UserImage userId={feedItem.userId} verticalAlign='middle' /></Feed.Label>
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
    </Feed.Event>);
};

const EventContainer = styled.div`
    display: grid;
    grid-template-columns: 4fr 8fr 3fr;
    grid-template-rows: 1fr 4% auto;
    ${'' /* grid-column-gap: 0.5rem; */}
    font-family: 'Lato', sans-serif;
    margin: 1rem 0;
    width: 100%;
`
const ShadowSegment = styled.div`
    margin: 1.5rem 0;
    padding: 1em 1em;
    box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
`
const Hours = styled(ShadowSegment)`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 3;
    justify-self: end;
    align-self: center;

    width: 90%;
    font-size: 18px;
    text-align: center;
    margin: 0;
    padding: 0.5rem 0;
    z-index: 10;
    background: white;
`
const Name = styled.h1`
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    justify-self: center;
    width: 90%;
    font-size: 14px;
    text-transform: uppercase;
    margin: 0;
    padding: 0 0.5rem;
`
const Date = styled.p`
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 2;
    justify-self: end;
    font-size: 11.5px;
    margin: 0;
    padding: 0;
`
// const EventCard = styled(ShadowSegment)`
//     display: grid;
//     position: relative;
//     width: 100%;
//     background: #fbf9f9;
//     padding-top: 1.5em;
//     margin: 0;
// `

const EventCard = styled(ShadowSegment)`
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 4;

    display: grid;
    grid-template-columns: 4fr 11fr;
    grid-template-rows: 2fr 1fr;
    ${'' /* grid-column-gap: 0.5rem; */}

    width: 100%;
    min-height: 10rem;    
    background: #fbf9f9;
    
    margin: 0;
    padding: 1rem 0;
`
const ImageArea = styled.div`
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
    justify-self: end;
    padding: 0.5rem 0 0 0.5rem;
`

const Summary = styled.div`
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    justify-self: center;
    width: 90%;
    
`
const Details = styled.div`
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
    align-self: end;
    justify-self: center;

    background: #efe8e8;
    width: 90%;
    padding: 0.8em 0.5em;   
`

const NewFeedItem = props => {
    const { feedItem } = props;
    return (<EventContainer>
        <Hours>{feedItem.hours} hours</Hours>
        <Name>{feedItem.name}</Name>
        <Date>{feedItem.date} ago</Date>
        <EventCard>
            <ImageArea><UserImage userId={feedItem.userId} size='small' inline/></ImageArea>
            
            <Summary>{feedItem.summary}</Summary>
            <Details>{feedItem.extra}</Details>
            
        </EventCard>
    </EventContainer>)
}

FeedItem.propTypes = {
    feedItem: PropTypes.object.isRequired,
}

export default NewFeedItem;