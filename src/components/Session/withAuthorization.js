import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { FirebaseAuthUserContext } from './FirebaseAuthUserProvider';
import * as routes from '../../constants/routes';

import { Dimmer, Loader } from 'semantic-ui-react';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        // componentDidMount() {
        //     console.log(this.props.user)
        //     i
        //     if(!authCondition(this.props.user))
        //         this.props.history.push(routes.HOME_PAGE);
        // } 
        
        render() {
            const { user } = this.props;
            if (user.pendingUser) return (
                <Dimmer active inverted page>
                    <Loader inverted content='Loading' />
                </Dimmer>
            )
            if (!authCondition(user)) return <Redirect to={routes.HOME_PAGE} />
            return (
                <Component />    
            );
        }
    }

    const WithAuthorizationWithUser = (props) =>
        <FirebaseAuthUserContext.Consumer>
            {user => <WithAuthorization {...props} user={user} />}
        </FirebaseAuthUserContext.Consumer>

    return withRouter(WithAuthorizationWithUser);
}

export default withAuthorization;