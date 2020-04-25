import React, { Component } from 'react';
import { Button, Message, Icon } from 'semantic-ui-react';
import FileUploader from 'react-firebase-file-uploader/lib/CustomUploadButton';

import { storage } from '../../firebase';

class ImageUpload extends Component {
	state = {
		uploadError: false,
		uploadSuccess: false,
		isUploading: false,
		progress: 0,
		imageName: '',
		image: ''
	}

	handleUploadStart = () => {
		this.setState( {
			uploadSuccess: false,
			isUploading: true,
			uploadError: false,
			progress: 0
		} );
		this.props.onStart && this.props.onStart();
	}

	handleProgress = progress => this.setState({ progress });

	handleUploadError = error => {
		this.setState( { isUploading: false, uploadError: error } );
		this.props.onError && this.props.onError( error );
		console.error(error);
	};

	handleUploadSuccess = ( filename, task ) => {
		this.setState( {
			imageName: filename,
			progress: 100,
			isUploading: false
		} );
		task.snapshot.ref
			.getDownloadURL()
			.then( image => {
				this.setState( {
					image,
					uploadSuccess: true
				} );
				return this.props.onUpload && this.props.onUpload( image );
			})
			.catch( error => {
				this.setState( { uploadError: error } )
				this.props.onError && this.props.onError( error );
			});
	};

	render() {
		const fileProps = {};
		if ( this.props.filename ) {
			fileProps.filename = this.props.filename;
		} else {
			fileProps.randomizeFilename = true;
		}
		let storageRef = storage.getRootRef();
		if ( this.props.prefix ) {
			storageRef = storageRef.child( this.props.prefix );
		}

		return (
			<div className="field">
				{ this.props.label && <label>{ this.props.label }</label> }
				<div className="ui file">
					{ ( this.props.image ) && (
						<div className="image-preview">
							<img
								width="300"
								src={ this.props.image }
								alt={ this.props.previewAlt || 'Preview' }
							/>
						</div>
					) }
					{ this.state.uploadError && (
						<Message
							negative
							header="There was a problem:"
							content={ this.state.uploadError.message }
						/>
					) }
					{ this.props.image && this.state.uploadSuccess && (
						<Message
							positive
							content={ this.props.successMessage || 'Image uploaded' }
						/>
					) }
					<FileUploader
						hidden
						accept="image/*"
						name={ this.props.name || 'image' }
						storageRef={storageRef}
						onUploadStart={this.handleUploadStart}
						onUploadError={this.handleUploadError}
						onUploadSuccess={this.handleUploadSuccess}
						onProgress={ this.handleProgress }
						metadata={ { cacheControl: 'max-age=86400' } }
						{...fileProps}
					>
						<Button disabled={ this.state.isUploading } as="div">{ this.props.image ? 'Change Image' : 'Choose Image' }</Button>
						{ " " }
						{ this.state.isUploading && <Icon loading name='spinner' /> }
					</FileUploader>
				</div>
			</div>
		)
	}
}

export default ImageUpload;
