import React, { Fragment } from "react";
import { Icon } from "semantic-ui-react";

import { db } from "../../firebase";
import LoadingCardView from "../LoadingCardView";

import moonScaffold from "../../moonScaffold.jpg";

class OrganisationPage extends React.Component {
  state = {
    name: "",
    description: "",
    hoursGenerated: null,
    loading: true
  };

  componentDidMount() {
    const match = this.props.match;
    console.log(match);
    db.getOrganisation(match.params.organisationId).then(
      ({ name, hoursGenerated, description }) => {
        this.setState({ name, hoursGenerated, description, loading: false });
      }
    );
  }

  render() {
    return (
      <LoadingCardView
        loading={this.state.loading}
        header={this.state.name || ""}
        description={this.state.description}
        meta={
          this.state.hoursGenerated !== null
            ? this.state.hoursGenerated + " people helped"
            : ""
        }
        image={moonScaffold}
        extra={
          <Fragment>
            <Icon name="group" />
            Organisation
          </Fragment>
        }
      />
    );
  }
}

export default OrganisationPage;
