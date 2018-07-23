import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../../firebase';
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


// class WithAuthorization extends React.Component {
//     componentDidMount() {
//         const { authCondition, user, history } = this.props;
//         if(!authCondition(user))
//             history.push(routes.HOME_PAGE);
//     } 
    
//     render() {
//         return (
//             <Fragment>
//                 {this.props.children}
//             </Fragment>
//         );
//     }
// }

// const WithAuthorizationWithRouter = withRouter(WithAuthorization);

// const withAuthorization = (authCondition) => (Component) =>
//     <AuthUserContext.Consumer>
//         {user => 
//         <WithAuthorizationWithRouter user={user} authCondition={authCondition}>
//             <Component />
//         </WithAuthorizationWithRouter>}
//     </AuthUserContext.Consumer>

export default withAuthorization;