import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button } from "semantic-ui-react";

import withAuthorization from "../Session/withAuthorization";
import * as routes from "../../constants/routes";
import ManageOrganisations from './ManageOrganisations';

const AdminPage = () => (
  <Grid padded columns={2}>
    <Grid.Column>
      <Grid.Row>
        <Button primary as={Link} to={routes.ADMIN_ADD_ORGANISATION}>
          Add Organisation
        </Button>
      </Grid.Row>
      <Grid.Row>
        <ManageOrganisations />
      </Grid.Row>
    </Grid.Column>
    <Grid.Column>
      <Grid.Row>
        <Button primary as={Link} to={routes.ADMIN_MANAGE_REQUESTS}>
          Manage token requests
        </Button>
      </Grid.Row>
    </Grid.Column>
  </Grid>
);

const authCondition = user => user.role === "ADMIN";
export default withAuthorization(authCondition)(AdminPage);
