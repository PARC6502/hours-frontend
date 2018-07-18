import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import AuthUserContext from './Session/AuthUserContext'
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const Navigation = () => 
    <AuthUserContext.Consumer>
        {userId => userId ? <NavigationAuth /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>

const NavigationAuth = () =>
    <Menu className="Menu">
        <Menu.Item as={NavLink} to={routes.ADD_HRS}>Add Hrs</Menu.Item>
        <Menu.Item as={NavLink} to={routes.SEND_HRS}>Send Hrs</Menu.Item>  
        <Menu.Item position='right'><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item>  
    </Menu>

const NavigationNonAuth = () => 
    <Menu className="Menu">
        <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item> 
    </Menu>

export default Navigation