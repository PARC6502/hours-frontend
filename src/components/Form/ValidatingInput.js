import React from 'react';
import { Form, Message } from 'semantic-ui-react';

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
        console.log('validating input rerendered')
        return (<>
            <Form.Input 
                name={this.props.name || ''} 
                label={this.props.label || ''} 
                type={this.props.type || ''} 
                value={this.props.value || ''}
                onChange={this.onChange}
                onBlur={this.onBlur} 
            />
            {this.state.error ? <Message negative>{this.state.error}</Message> : null}
        </>);
    }   
}

export default ValidatingInput;