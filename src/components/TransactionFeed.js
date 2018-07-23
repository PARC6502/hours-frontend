import React, { Component } from 'react';
import { Feed, Segment, Dimmer, Loader, Image, Grid } from 'semantic-ui-react';

import { timeSince } from '../helpers'
import { db } from '../firebase';

import jennySmall from '../jennySmall.jpg';
import elliotSmall from '../elliotSmall.jpg';
import helenSmall from '../helenSmall.jpg';
import joeSmall from '../joeSmall.jpg';
import './TransactionFeed.css';

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
    <Feed id="transactionFeed">
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
)

class TransactionFeed extends Component {
    state = {
        transactions: null,
        loading: true
    }

    componentDidMount() {
        let feedItems = [];
        db.getTransactions()
        .then(transactions => {
            feedItems = transactions.map(transaction => {
                // TODO check transaction type
                const {id, fromName, from, toName, to, description, hours, dateCreated} = transaction;
                // if (type === 'Log Hours')
                return {
                    id,
                    summary: `${toName} recieved ${hours} hours from ${fromName}`,
                    date: timeSince(dateCreated),
                    extra: description,
                    fromId: from,
                    toId: to,
                };
                // return
            });
            console.log(feedItems);
            this.setState({ transactions: feedItems, loading: false })
        })
    }

    render() {
        const feedItems = this.state.transactions || dummyFeed;
        return (
            <Grid centered columns={2} id="transactionFeedContainer">
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

export default TransactionFeed

