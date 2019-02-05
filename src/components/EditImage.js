import React from 'react';
import { Form, Image, Message } from 'semantic-ui-react';

import { storage, db } from '../firebase';

class EditImage extends React.Component {
    state = {
        image: null,
        imageUrl: this.props.imageUrl,
        loading: false,
        success: false,
        error: false,
    }

    onChange = (evt) => {
        const image = evt.target.files[0];
        const imageUrl = window.URL.createObjectURL(image);
        this.setState({ 
            image, 
            imageUrl,
            error: false,
            success: false,
        });
    }

    // Removing progress bar for now as most images should be too small
    uploadImage = () => {
        this.setState({ loading: true });
        storage.uploadUserImage(this.props.userId, this.state.image)
        .then(imageUrl => db.editUserImage(this.props.userId, imageUrl))
        .then(() => this.setState({ loading: false, success: true }))
        .catch(() => this.setState({ loading: false, error: true }))
        // let uploadTask = storage.uploadUserImage(this.props.userId, this.state.image);
        // let next = snapshot => {
        //     let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log(progress);
        // }
        // let error = () => {
        //     this.setState({ loading: false, error: true })
        // }
        // let complete = () => {
        //     this.setState({ loading: false, success: true })
        // }
        // uploadTask.on('state_changed', next, error, complete);
    }
    
    render() {
        const imageChanged = (this.props.imageUrl !== this.state.imageUrl) && !this.state.success;

        return (
            <Form success={this.state.success} error={this.state.error}>
                {this.state.imageUrl ? <Image size='small' centered src={this.state.imageUrl} /> : null}
                <Form.Input
                    accept="image/*" 
                    type='file' label='Edit Profile Image' 
                    onChange={this.onChange} />
                <Message success content="Profile image successfully updated!" />
                <Message error content="There was a problem uploading your image, sorry about that!" />
                
                <Form.Button
                    onClick={this.uploadImage}
                    color='green' 
                    fluid
                    loading={this.state.loading}
                    disabled={!imageChanged} >Save</Form.Button>
            </Form>
        )
    }
}

export default EditImage