import React, { Fragment } from "react";
import { Segment } from "semantic-ui-react";

import EventFeed from "./EventFeed";

const HomePage = () => (
  <Fragment>
    <Segment>Welcome to the mutual impact feed</Segment>
    <EventFeed />
  </Fragment>
);

export default HomePage;
