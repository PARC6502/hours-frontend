import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

import UserImage from '../UserImage';


export default props =>
    <Grid>
        <Grid.Row columns={2}>
            <Grid.Column width={6}>
                <UserImage src={props.user.image} size='tiny' />
            </Grid.Column>
            <Grid.Column>
                <Grid.Row>
                    <Header>
                        <Header.Subheader>{props.user.name}</Header.Subheader>
                        {props.user.hours}
                    </Header>
                </Grid.Row>
            </Grid.Column>
        </Grid.Row>
    </Grid>