import React from 'react';
import { Feed, Segment, Image } from "semantic-ui-react";
import { getImageSize } from '../helpers';

import "./HomePage/EventFeed.css";

import jennySmall from "../jennySmall.jpg";

const ActivityFeed = props => (
  <Feed id="eventFeed">
    {props.items.map(feedItem => (
      <Feed.Event key={feedItem.id}>
        <Feed.Label className="middle aligned">
          <Image
            src={ getImageSize( feedItem.userPhoto, 'square_sm' ) || jennySmall }
            verticalAlign="middle"
          />
        </Feed.Label>
        <Feed.Content>
          <Segment className="feed item" raised>
            <Feed.Summary>
              {feedItem.summary}
              <Feed.Date>{feedItem.date} ago</Feed.Date>
            </Feed.Summary>
            <Feed.Extra images>
              { feedItem.extra && <p>{ feedItem.extra }</p> }
              { /* feedItem.orgPhoto && (
                <a href={ feedItem.orgPhoto } download>
                  <img src={ getImageSize( feedItem.orgPhoto, 'letter_md' ) } alt="Org logo" />
                </a>
              ) */ }
              { feedItem.photo && (
                <a href={ feedItem.photo } download>
                  <img
                    src={ getImageSize( feedItem.photo, 'letter_md' ) }
                    alt={ feedItem.extra }
                    style={{width: '100%'}}
                  />
                </a>
              ) }
            </Feed.Extra>
          </Segment>
        </Feed.Content>
      </Feed.Event>
    ))}
  </Feed>
);

export default ActivityFeed;
