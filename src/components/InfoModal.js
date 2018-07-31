import React, { Component } from 'react'
import { Grid, Button, Image, Modal } from 'semantic-ui-react'

import nan from '../nan.jpg';
import daniel from '../daniel.jpg';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';

const infoPanes = [
    {
        text: 'Hours gives you wings',
        image: nan,
    },
    {
        text: 'Hours kills lizard people',
        image: daniel,
    },
    {
        text: 'All hail hours, the one true god',
        image: nan,
    },
]

class InfoGallery extends Component {
    state = {
        activeIndex: 0,
    }

    onLeftClick = () => this.setState(prevState => {
        if (prevState.activeIndex < 1) return {
            activeIndex: this.props.panes.length - 1,
        };
        return {
            activeIndex: prevState.activeIndex - 1,
        }
    })
    
    onRightClick = () => this.setState(prevState => {
        if (prevState.activeIndex > this.props.panes.length - 2) return {
            activeIndex: 0,
        }
        return {
            activeIndex: prevState.activeIndex + 1
        }
    })

    onButtonClick = (e, {name}) => this.setState({ activeIndex: name })
    
    render() {
        const {panes} = this.props;
        const {activeIndex} = this.state;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2} verticalAlign='middle'>
                        <Button basic icon='chevron left' onClick={this.onLeftClick} />
                    </Grid.Column>
                    <Grid.Column width={6}><p>{panes[activeIndex].text}</p></Grid.Column>
                    <Grid.Column width={6}><Image src={panes[activeIndex].image} /></Grid.Column>
                    <Grid.Column width={2} verticalAlign='middle'>
                        <Button basic icon='chevron right' onClick={this.onRightClick} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    {panes.map((_pane,index) => 
                        <Button
                            key={`button-${index}`} 
                            name={index} 
                            basic={activeIndex===index} 
                            onClick={this.onButtonClick} 
                            circular icon color='black'
                            size='mini'  /> )}
                </Grid.Row>
            </Grid>
        );
    } 
}

class InfoModal extends Component {
  state = { 
      modalOpen: false,
      wasSignedIn: false,
    }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  componentDidMount() {
      const {user} = this.props;
      if (user.isUserSignedIn)
        this.setState({ wasSignedIn: true });
      if (!user.isUserSignedIn && !user.pendingAuth && !this.state.wasSignedIn)
        this.handleOpen();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user === this.props.user) return;
    const {user} = this.props;
    if (user.isUserSignedIn)
      this.setState({ wasSignedIn: true });
    if (!user.isUserSignedIn && !user.pendingAuth && !this.state.wasSignedIn)
      this.handleOpen();
  }

  render() {
    const {user} = this.props;
    const {modalOpen, alreadyShown} = this.state;
    
    if (user.isUserSignedIn || alreadyShown) return null;

    return (
      <Modal
        open={modalOpen}
        onClose={this.handleClose}
        size='small'
        closeIcon
      >
        <Modal.Content>
            <InfoGallery panes={infoPanes} />  
        </Modal.Content>
      </Modal>
    )
  }
}

const InfoModalWithUser = () =>
    <FirebaseAuthUserContext.Consumer>
        {user => <InfoModal user={user} />}
    </FirebaseAuthUserContext.Consumer>

export default InfoModalWithUser