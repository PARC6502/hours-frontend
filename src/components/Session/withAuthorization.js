import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            firebase.auth.onAuthStateChanged(userId => {
                if(!authCondition(userId))
                    this.props.history.push(routes.HOME_PAGE);
            });
        } 
        
        render() {
            return (
                <AuthUserContext.Consumer>
                    {userId => <Component />}
                </AuthUserContext.Consumer>    
            );
        }
    }

    return withRouter(WithAuthorization);
}

export default withAuthorization;