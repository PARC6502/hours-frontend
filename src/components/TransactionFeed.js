import React, { Component } from 'react';
import { Feed, Segment, Dimmer, Loader } from 'semantic-ui-react';

import { timeSince } from '../helpers'
import { db } from '../firebase';

const dummyFeed = [
    {
        id: 0,
        summary: ` recieved  hours from `,
        extra: 'description',
        fromId: 'from',
        toId: 'to',
    }
];

const FeedFromArray = (props) => (
    <Feed>
        {props.feedItems.map(feedItem => 
        <Feed.Event key={feedItem.id}>
            <Feed.Content>
            <Feed.Summary>
                {feedItem.summary}
                <Feed.Date>{feedItem.date} ago</Feed.Date>
            </Feed.Summary>
            <Feed.Extra text>
                {feedItem.extra}
            </Feed.Extra>
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
                const {id, fromName, from, toName, to, description, hours, type, dateCreated} = transaction;
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
            <Segment>
                <Dimmer active={this.state.loading}>
					<Loader content="loading" />
				</Dimmer>
                <FeedFromArray feedItems={feedItems} />
            </Segment>
        );
    }
}

export default TransactionFeed

