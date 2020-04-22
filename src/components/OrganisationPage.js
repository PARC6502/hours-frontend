import React, { Fragment } from "react";
import { Icon } from "semantic-ui-react";

import { db } from "../firebase";
import LoadingCardView from "./LoadingCardView";
import OrganisationFeed from "./OrganisationFeed";

import moonScaffold from "../moonScaffold.jpg";

class OrganisationPage extends React.Component {
  state = {
    name: "",
    hoursGenerated: null,
    loading: true
  };

  componentDidMount() {
    const match = this.props.match;
    db.getOrganisation(match.params.organisationId).then(
      ({ name, hoursGenerated }) => {
        this.setState({ name, hoursGenerated, loading: false });
      }
    );
  }

  render() {
    const match = this.props.match;
    const organisationId = match.params.organisationId;

    return <Fragment>
      <LoadingCardView
        loading={this.state.loading}
        header={this.state.name || ""}
        meta={
          this.state.hoursGenerated !== null
            ? this.state.hoursGenerated + " Total people helped"
            : ""
        }
        image={moonScaffold}
        extra={
          <Fragment>
            <Icon name="group" /> Group
          </Fragment>
        }
      />
      <OrganisationFeed orgId={organisationId} />
    </Fragment>;
  }
}

export default OrganisationPage;
