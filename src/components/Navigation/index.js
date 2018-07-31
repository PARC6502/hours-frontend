import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import SearchMembers from './SearchMembers';
import AccountDropdown from './AccountDropdown';
import { FirebaseAuthUserContext } from '../Session/FirebaseAuthUserProvider';
import * as routes from '../../constants/routes';

const Navigation = () => 
    <FirebaseAuthUserContext.Consumer>
        {user => user.isUserSignedIn && !user.pendingUser ? <NavigationAuth user={user} /> : <NavigationNonAuth />}
    </FirebaseAuthUserContext.Consumer>

const NavigationAuth = (props) => {
    const isAdmin = props.user.role === 'ADMIN';
    
    return (
        <Menu stackable>
        <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.ADD_HRS}>Log Hrs</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SEND_HRS}>Send Hrs</Menu.Item>  
        <Menu.Item as={NavLink} to={routes.PROFILE}>Your Profile</Menu.Item>  
        {isAdmin ? <Menu.Item as={NavLink} to={routes.ADMIN_PAGE}>Admin Page</Menu.Item> : null}
        <Menu.Menu position='right'>
            <SearchMembers className="right aligned item" />
            <AccountDropdown user={props.user} />
            {/* <Menu.Item><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item> */}
        </Menu.Menu>  
    </Menu>
    )
}
    

const NavigationNonAuth = () => 
    <Menu>
        <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item> 
        <Menu.Item as={NavLink} to={routes.SIGN_UP}>Sign up</Menu.Item> 
    </Menu>

export default Navigation