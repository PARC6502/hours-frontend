import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button } from "semantic-ui-react";

import withAuthorization from "../Session/withAuthorization";
import * as routes from "../../constants/routes";

const AdminPage = () => (
  <Grid padded>
    <Grid.Row>
      <Button as={Link} to={routes.ADMIN_ADD_ORGANISATION}>
        Add Organisation
      </Button>
    </Grid.Row>
    <Grid.Row>
      <Button as={Link} to={routes.ADMIN_MANAGE_REQUESTS}>
        Manage token requests
      </Button>
    </Grid.Row>
  </Grid>
);

const authCondition = user => user.role === "ADMIN";
export default withAuthorization(authCondition)(AdminPage);
