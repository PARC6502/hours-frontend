import React, { Fragment } from 'react';
import { Form, Image } from 'semantic-ui-react';

import { db } from '../firebase';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';

class EditProfile extends React.Component {
    state = {
        bio: this.props.user.bio,
        image: null,
        imageUrl: this.props.user.image,
        loading: false,
    }

    onBioChange = (evt, { value }) => {
        this.setState({ bio: value });
    };

    onImageChange = (evt) => {
        const image = evt.target.files[0];
        const imageUrl = window.URL.createObjectURL(image);
        this.setState({ image, imageUrl });
    }

    uploadImage = () => {
        // storage.upload
    }

    render() {
        // console.log(this.props.user);

        const profileChanged = (this.props.user.bio !== this.state.bio)
                            || (this.props.user.image !== this.state.image);

        // console.log(profileChanged);
        return (
            <Form>
                {this.state.imageUrl ? <Image src={this.state.imageUrl} /> : null}
                <Form.Input
                    accept="image/*" 
                    type='file' label='Edit Profile Image' onChange={this.onImageChange} />
                <Form.TextArea label='Edit Bio' content={this.state.bio} name='bio' onChange={this.onBioChange}/>
                <Form.Button 
                    fluid
                    disabled={!profileChanged} >Update Profile</Form.Button>
            </Form>
        );
    }
}

const EditProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <EditProfile user={user} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(EditProfilePage);