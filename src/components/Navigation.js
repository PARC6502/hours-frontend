import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import SearchMembers from './SearchMembers'
import AuthUserContext from './Session/AuthUserContext'
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const Navigation = () => 
    <AuthUserContext.Consumer>
        {user => user.id ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>

const NavigationAuth = () =>
    <Menu className="Menu">
        <Menu.Item as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.ADD_HRS}>Log Hrs</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SEND_HRS}>Send Hrs</Menu.Item>  
        <Menu.Item as={NavLink} to={routes.PROFILE}>Your Profile</Menu.Item>  
        {/* <Menu.Item as={NavLink} to={routes.MANAGE_ACCOUNT}>Account</Menu.Item>   */}
        <Menu.Item position='right'><SearchMembers /></Menu.Item>  
        <Menu.Item position='right'><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item>  
    </Menu>

const NavigationNonAuth = () => 
    <Menu className="Menu">
        <Menu.Item as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item> 
        <Menu.Item as={NavLink} to={routes.SIGN_UP}>Sign up</Menu.Item> 
    </Menu>

export default Navigation