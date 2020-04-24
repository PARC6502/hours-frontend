import React, { Fragment } from "react";
import { Segment } from "semantic-ui-react";

import EventFeed from "./EventFeed";

const HomePage = () => (
  <Fragment>
    <Segment>
      <h3>Welcome to the mutual impact feed</h3>
      <p>
        Please note: this feed is only populated with data that has been
        collected and uploaded.
      </p>
      <p>
        An absence of data for a given area should not be interpreted to mean
        that work hasn't happened, just that it hasn't been recorded.
      </p>
    </Segment>
    <EventFeed />
  </Fragment>
);

export default HomePage;
