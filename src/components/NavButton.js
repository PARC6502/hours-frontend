import React from 'react';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

class Nav extends React.Component {
    render() {
        return <NavLink {...this.props} />
    }
}

export default (props) => <Button as={Nav} {...props}/>