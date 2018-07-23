import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import SearchMembers from './SearchMembers'
import AccountDropdown from './AccountDropdown';
import AuthUserContext from './Session/AuthUserContext'
import * as routes from '../constants/routes';

const Navigation = () => 
    <AuthUserContext.Consumer>
        {user => user.id ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>

const NavigationAuth = () =>
    <Menu stackable>
        <Menu.Item as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.ADD_HRS}>Log Hrs</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SEND_HRS}>Send Hrs</Menu.Item>  
        <Menu.Item as={NavLink} to={routes.PROFILE}>Your Profile</Menu.Item>  
        {/* <Menu.Item as={NavLink} to={routes.MANAGE_ACCOUNT}>Account</Menu.Item>   */}
        <Menu.Menu position='right'>
            <SearchMembers className="right aligned item" />
            <AccountDropdown />
            {/* <Menu.Item><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item> */}
        </Menu.Menu>  
    </Menu>

const NavigationNonAuth = () => 
    <Menu>
        <Menu.Item as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item> 
        <Menu.Item as={NavLink} to={routes.SIGN_UP}>Sign up</Menu.Item> 
    </Menu>

export default Navigation