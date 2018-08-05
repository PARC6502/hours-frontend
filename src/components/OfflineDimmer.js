import React, { Component } from 'react';

import { Dimmer, Header, Icon } from 'semantic-ui-react' 

class OfflineDimmer extends Component {
    state = {
        active: false
    }

    close = () => this.setState({ active: false });

    handleOnline = () => {
        console.log('online');
        this.close()
    };

    handleOffline = () => this.setState({ active: true })

    componentDidMount() {
        window.addEventListener('online',  this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }

    render() {
        return (
            <Dimmer active={this.state.active} onClickOutside={this.close} page>
                <Header as='h2' icon inverted>
                    <Icon name='wifi' />
                    Your computer is offline
                </Header>
            </Dimmer>
        )
    }
}

export default OfflineDimmer