import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import * as routes from '../../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            console.log(this.props.user)
            if(!authCondition(this.props.user))
                this.props.history.push(routes.HOME_PAGE);
        } 
        
        render() {
            return (
                <Component />    
            );
        }
    }

    const WithAuthorizationWithUser = (props) =>
        <AuthUserContext.Consumer>
            {user => <WithAuthorization {...props} user={user} />}
        </AuthUserContext.Consumer>

    return withRouter(WithAuthorizationWithUser);
}

export default withAuthorization;