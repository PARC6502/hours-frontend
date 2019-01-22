import React from 'react'
import { Form, Message } from 'semantic-ui-react';

import { db } from '../firebase';

class EditBio extends React.Component {
    state = {
        bio: this.props.bio,
        loading: false,
        success: false,
        error: false
    }

    onChange = (_evt, { value }) => {
        this.setState({ bio: value });
    };

    saveBio = () => {
        this.setState({ loading: true });
        db.editUserBio(this.props.userId, this.state.bio)
        .then(result => {
            console.log(result);
            this.setState({ success: true });
        })
        .catch(error => {
            console.log(error);
            this.setState({ error: true });
        })
        .then(() => { 
            this.setState({ loading: false })
            console.log(this.props.bio)
        })
    }
    
    render() {

        const bioChanged = (this.props.bio !== this.state.bio);

        return (
            <Form success={this.state.success} error={this.error}>
                    <Form.TextArea 
                        label='Edit Bio' 
                        value={this.state.bio} 
                        name='bio' 
                        onChange={this.onChange}/>
                    <Message success content="Bio successfully updated!" />
                    <Message error content="There was a problem updating your bio, sorry about that!" />
                    <Form.Button
                        onClick={this.saveBio}
                        color='green' 
                        fluid
                        loading={this.state.loading}
                        disabled={!bioChanged} >Save</Form.Button>
            </Form>
        )
    }
}

export default EditBio;