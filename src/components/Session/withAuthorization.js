import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            firebase.auth.onAuthStateChanged(user => {
                if(!authCondition(user))
                    this.props.history.push(routes.HOME_PAGE);
            });
        } 
        
        render() {
            return (
                <AuthUserContext.Consumer>
                    {user => <Component />}
                </AuthUserContext.Consumer>    
            );
        }
    }

    return withRouter(WithAuthorization);
}

export default withAuthorization;