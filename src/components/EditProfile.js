import React, { Fragment } from 'react';
import { Form, Image, Message } from 'semantic-ui-react';

import { db } from '../firebase';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';

class EditProfile extends React.Component {
    state = {
        bio: this.props.user.bio,
        image: null,
        imageUrl: this.props.user.image,
        loading: false,
        bioSuccess: false,
        bioError: false
    }

    onBioChange = (evt, { value }) => {
        this.setState({ bio: value });
    };

    saveBio = () => {
        this.setState({ loading: true });
        db.editUserBio(this.props.user.id, this.state.bio)
        .then(result => {
            console.log(result);
            this.setState({ bioSuccess: true });
        })
        .catch(error => {
            console.log(error);
            this.setState({ bioError: true });
        })
        .then(() => { 
            this.setState({ loading: false })
            console.log(this.props.user.bio)
        })
    }

    onImageChange = (evt) => {
        const image = evt.target.files[0];
        const imageUrl = window.URL.createObjectURL(image);
        this.setState({ image, imageUrl });
    }

    uploadImage = () => {
        // storage.upload
    }

    render() {
        const bioChanged = (this.props.user.bio !== this.state.bio);

        const imageChanged = (this.props.user.image !== this.state.image);

        console.log(this.state);
        return (
            <Fragment>
                <Form>
                    {this.state.imageUrl ? <Image src={this.state.imageUrl} /> : null}
                    <Form.Input
                        accept="image/*" 
                        type='file' label='Edit Profile Image' 
                        onChange={this.onImageChange} />
                    <Form.Button
                        color='green' 
                        fluid
                        disabled={!imageChanged} >Save</Form.Button>
                </Form>
                <Form success={this.state.bioSuccess} error={this.state.bioError}>
                    <Form.TextArea 
                        label='Edit Bio' 
                        value={this.state.bio} 
                        name='bio' 
                        onChange={this.onBioChange}/>
                    <Message success content="Bio successfully updated!" />
                    <Message error content="There was a problem updating your bio, sorry about that!" />
                    <Form.Button
                        onClick={this.saveBio}
                        color='green' 
                        fluid
                        disabled={!bioChanged} >Save</Form.Button>
                </Form>
            </Fragment>
        );
    }
}

const EditProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <EditProfile user={user} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(EditProfilePage);