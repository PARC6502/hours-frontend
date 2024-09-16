import React from 'react';
import { Redirect } from 'react-router-dom';

import { FirebaseAuthUserContext } from './FirebaseAuthUserProvider';
import * as routes from '../../constants/routes';

import { Dimmer, Loader } from 'semantic-ui-react';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        render() {
            const { user } = this.props;
            if (user.pendingUser) return (
                <Dimmer active inverted page>
                    <Loader inverted content='Loading' />
                </Dimmer>
            )
            if (!authCondition(user)) return <Redirect to={routes.HOME_PAGE} />
            return (
                <Component {...this.props} />
            );
        }
    }

    const WithAuthorizationWithUser = (props) =>
        <FirebaseAuthUserContext.Consumer>
            {user => <WithAuthorization {...props} user={user} />}
        </FirebaseAuthUserContext.Consumer>

    return WithAuthorizationWithUser;
}

export default withAuthorization;
