import React from 'react';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ProfileHeader from './ProfileHeader';
import Bio from './Bio';
import NavButton from '../NavButton';
import PersonalFeed from '../PersonalFeed';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';


const ProfileDisplay = props => {
    // console.log(props.user)
    const isCurrentUser = props.user.id === auth.getCurrentUserId() ? true : false;
    return (
        <Grid stackable>
            <Grid.Column width={6}>
                <ProfileHeader user={props.user} />
                {props.user.bio ? <Bio bioText={props.user.bio} /> : null}
                {isCurrentUser ? <NavButton to={routes.EDIT_PROFILE} icon='edit' content='Edit profile' /> : null}
            </Grid.Column>
            <Grid.Column width={10}>
                <PersonalFeed userId={props.user.id} />
            </Grid.Column>
        </Grid>);
}

ProfileDisplay.propTypes = {
    user: PropTypes.object.isRequired,
}

export default ProfileDisplay;