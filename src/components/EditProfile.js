import React, { Fragment } from 'react';
import { Form, Image, Message } from 'semantic-ui-react';

import { db, storage } from '../firebase';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';

class EditProfile extends React.Component {
    state = {
        bio: this.props.user.bio,
        image: null,
        imageUrl: this.props.user.image,
        uploadingImage: false,
        imageError: false,
        imageSuccess: false,
        bioLoading: false,
        bioSuccess: false,
        bioError: false
    }

    onBioChange = (evt, { value }) => {
        this.setState({ bio: value });
    };

    saveBio = () => {
        this.setState({ bioLoading: true });
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
        this.setState({ 
            image, 
            imageUrl,
            imageError: false,
            imageSuccess: false,
        });
    }

    // Removing progress bar for now as most images should be too small
    uploadImage = () => {
        this.setState({ uploadingImage: true });
        let uploadTask = storage.uploadUserImage(this.props.user.id, this.state.image);

        let next = snapshot => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }
        let error = () => {
            this.setState({ uploadingImage: false, imageError: true })
        }
        let complete = () => {
            this.setState({ uploadingImage: false, imageSuccess: true })
        }
        
        uploadTask.on('state_changed', next, error, complete);
    }

    render() {
        const bioChanged = (this.props.user.bio !== this.state.bio);

        const imageChanged = (this.props.user.image !== this.state.imageUrl) && !this.state.imageSuccess;

        // TODO separate TextArea to avoid unecessarily rerendering whole page, method of measuring performance?
        return (
            <Fragment>
                <Form success={this.state.imageSuccess} error={this.state.imageError}>
                    {this.state.imageUrl ? <Image size='small' centered src={this.state.imageUrl} /> : null}
                    <Form.Input
                        accept="image/*" 
                        type='file' label='Edit Profile Image' 
                        onChange={this.onImageChange} />
                    <Message success content="Profile image successfully updated!" />
                    <Message error content="There was a problem uploading your image, sorry about that!" />
                   
                    <Form.Button
                        onClick={this.uploadImage}
                        color='green' 
                        fluid
                        loading={this.state.uploadingImage}
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
                        loading={this.state.bioLoading}
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