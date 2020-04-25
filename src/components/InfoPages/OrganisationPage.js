import React, { Fragment } from "react";
import { Icon } from "semantic-ui-react";

import { db } from "../../firebase";
import LoadingCardView from "../LoadingCardView";
import OrganisationFeed from '../OrganisationFeed';
import { getImageSize } from '../../helpers';

class OrganisationPage extends React.Component {
  state = {
    name: "",
    description: "",
    hoursGenerated: null,
    mealsProvided: null,
    loading: true,
    photo: null
  };

  componentDidMount() {
    const match = this.props.match;
    db.getOrganisation(match.params.organisationId).then(
      ({ name, hoursGenerated, mealsProvided, photo, description }) => {
        this.setState({
          name,
          hoursGenerated,
          mealsProvided,
          description,
          photo,
          loading: false
        });
      }
    );
  }

  render() {
    const match = this.props.match;
    const meta = [];
    if ( this.state.hoursGenerated ) {
      meta.push( `${ this.state.hoursGenerated } people helped` );
    }
    if ( this.state.mealsProvided ) {
      meta.push( `${ this.state.mealsProvided } meals provided` );
    }
    return (
      <Fragment>
        <LoadingCardView
          loading={this.state.loading}
          header={this.state.name || ""}
          description={this.state.description}
          meta={ meta.join(', ')}
          image={ getImageSize( this.state.photo, 'square_md' ) }
          extra={
            <Fragment>
              <Icon name="group" />
              Organisation
            </Fragment>
          }
        />
        <OrganisationFeed orgId={match.params.organisationId} />
      </Fragment>
    );
  }
}

export default OrganisationPage;
