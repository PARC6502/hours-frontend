import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';


import { db } from '../../firebase';

class UsersDropdown extends Component {
    state = {
        users: [],
        loading: true,
    };

    componentDidMount() {
        console.info(this.props.user)
        db.getUsers()
        .then(users => users.filter(user => user.id !== this.props.user.id))
        .then(users => this.setState({ users, loading: false }))
        .catch(error => console.log(error))
    }
  
    render() {
        const userOptions = this.state.users.map(user => (
        {
            text: user.name,
            value: user.id,
        }));
        const { onChange, value } = this.props;
        return (
            <Form.Dropdown
                loading={this.state.loading}
                name="user" 
                fluid search selection
                label="Pick a user from the dropdown, or type their name"
                placeholder="Select a user..." 
                options={userOptions}
                value={value} 
                onChange={onChange} />
        )
    }
}

export default UsersDropdown;