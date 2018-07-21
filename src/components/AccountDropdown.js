import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

import AuthUserContext from './Session/AuthUserContext';
import { auth } from '../firebase';

const AccountDropdown = (props) => {
    
    return (
        <Dropdown 
            item button labeled simple
            className='icon'
            icon='user'
            text={props.user.name}    
        >
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => auth.doSignOut()}>Log out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

const AccountDropdownWithUser = () => (
    <AuthUserContext.Consumer>
        {user => <AccountDropdown user={user} />}
    </AuthUserContext.Consumer>
);

export default AccountDropdownWithUser;