import React from 'react';
import PropTypes from 'prop-types';
import { Form, Image } from 'semantic-ui-react';

class ImageField extends React.Component {
    state = {
        image: null,
        imageUrl: null,
    }

    onChange = (evt, data) => {
        console.log(data);
        const image = evt.target.files[0];
        const imageUrl = window.URL.createObjectURL(image);
        this.setState({ 
            image, 
            imageUrl,
        });
        this.props.onChange(evt, {name: this.props.name, value: image });
    }
    
    render() {

        return (
            <>
                {this.state.imageUrl ? <Image size='small' centered src={this.state.imageUrl} /> : null}
                <Form.Input
                    accept="image/*" 
                    type='file' 
                    label={this.props.label} 
                    onChange={this.onChange} />
            </>
        )
    }
}

ImageField.propTypes = {
    name: PropTypes.string.isRequired, 
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
}

ImageField.defaultProps = {
    label: 'Image upload'
}

export default ImageField