import React from 'react';
import { Form } from 'semantic-ui-react';


const UsersDropdown = props => {
    const { users, loading, value, onChange } = props;

    const userOptions = users.map((user,index) => (
        {
            text: user.name,
            value: index,
        }));
    return (
        <Form.Dropdown
            loading={loading}
            name="selectedUserIndex" 
            fluid search selection
            label="Pick a user from the dropdown, or type their name"
            placeholder="Select a user..." 
            options={userOptions}
            value={value} 
            onChange={onChange}
            />
    )
}

export default UsersDropdown;