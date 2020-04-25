import React, { Fragment } from "react";
import { Segment } from "semantic-ui-react";

const AboutPage = () => (
  <Fragment>
    <Segment>
      <h1>What is this?</h1>
      <p>
        Mutual impact is an impact tracker for the National Food Service and
        partnering mutual community groups to collect vital evidence to
        demonstrate impact as a whole.
      </p>
      <p>
        This allows accessiblity and transparency. To paint a picture to the
        public and can be shared with funders to enable more support for work.{" "}
      </p>
      <p>
        It also aims to remove some administrative burden and enable automatic
        reports and grant applications in the future, as well as increasing the
        total evidence base for Mutual Aid and voluntary labor.
      </p>
      <h2>How do I get involved?</h2>
      <p>
        To log your organisations impact, please{" "}
        <a href="https://www.mutualimpact.site/sign-in">Sign In</a>
      </p>

      <p>We also warmly welcome any help developing the webapp.</p>
      <ul>
        <li>
          Please get in touch with us at{" "}
          <a href="mailto:info@nationalfoodservice.uk">
            info@nationalfoodservice.uk
          </a>
        </li>
        <li>
          We have a{" "}
          <a href="https://github.com/ldpohl1/Mutualimpact/k">
            GitHub repository for the project{" "}
          </a>
          with more info about how to help develop the webapp{" "}
        </li>
        <li>
          User stories are on{" "}
          <a href="https://trello.com/b/6yiDv1ZW/mutual-impact">
            this Trello board
          </a>
        </li>
        <li>
          We discuss development on the{" "}
          <a href="national-food-service.slack.com">
            National Food Service Slack
          </a>
        </li>
      </ul>
      <p>
        For more information on the National Food Service campaign, please{" "}
        <a href="https://nationalfoodservice.uk">check out our site!</a>
      </p>
    </Segment>
  </Fragment>
);

export default AboutPage;
