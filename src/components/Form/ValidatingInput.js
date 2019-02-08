import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ValidatingInput extends React.PureComponent {
    state = {
        error: false 
    }
    
    onChange = (e, data) => {
        if (this.props.onChange) this.props.onChange(e, data);
    }
    
    onBlur = () => {
        let error = this.props.validate ? this.props.validate(this.props.value) : false;
        this.setState({ error })
    };

    render() {
        let {name, label, type, value, validate, ...otherProps} = this.props;
        // console.log(this.props.name + ' - validating input rerendered')
        return (<>
            <Form.Input 
                name={name || ''} 
                label={label || ''} 
                type={type || ''} 
                value={value || ''}
                onChange={this.onChange}
                onBlur={this.onBlur}
                {...otherProps} 
            />
            {this.state.error ? <Message negative>{this.state.error}</Message> : null}
        </>);
    }   
}

ValidatingInput.propTypes = {
    name: PropTypes.string.isRequired, 
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    label: PropTypes.string,
    // required: PropTypes.bool,
}

export default ValidatingInput;