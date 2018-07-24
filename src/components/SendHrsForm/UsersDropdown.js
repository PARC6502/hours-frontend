import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';


import { db } from '../../firebase';

class UsersDropdown extends Component {
    state = {
        users: [],
        loading: true,
    };
    
  
    // onChange = (evt, {name, value}) => {
    //   this.setState({ value });
    //   this.props.onChange(evt, {name, value});
    // }
  
    // componentWillReceiveProps(update) {
    //   this.setState({ value: update.value });
    // }
  
    componentDidMount() {
        db.getUsers()
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