import React from 'react';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { UsersContext } from './Session/withUsers';
import nan from '../nan.jpg'

function findUserImage(users, id) {
    if (users.loading) return null; 
    let user = users.data.find(user => {
        return user.id === id
    });
    if (user && user.image) return user.image;
    return nan;
}

const UserImage = props => {
    let { users, userId, src, ...restProps} = props;
    let imageSrc = nan;
    if (src) imageSrc = src;
    if (props.users) imageSrc = findUserImage(users, userId); 
    return <Image src={imageSrc} {...restProps} />
}

const UserImageWithUsers = props => {
    if (props.src) return <UserImage {...props} />;
    return (<UsersContext.Consumer>
        {users =>  <UserImage users={users} { ...props } /> }
    </UsersContext.Consumer>);
};

UserImageWithUsers.propTypes = {
    userId: PropTypes.string,
    src: PropTypes.string,
}

export default UserImageWithUsers;