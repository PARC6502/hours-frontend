import React, { Component, Fragment } from 'react'
import { Grid, Button, Image, Modal, Header } from 'semantic-ui-react'

import aboutUs from '../images/jumpyHours.png';
import howItWorks from '../images/helping.jpg';
import logHours from '../images/logHours.png';
import spendHours from '../images/shopSupport.png';
import exchangeHours from '../images/greatTime.png';
import keepTrack from '../images/ToolExchange.png';
import supporters from '../images/supporters.png';

import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';

const infoPanes = [
    {
        header: `About Us`,
        text: `Hours is a new time based cryptocurrency platform that gives a tangible value to voluntary sector and community activity, so that patrons, businesses and communities can support the hard-working people in nonprofits and in the local area to champion their work. Hours also unlocks innovative mutual aid and trust pathways between, otherwise unconnected, organisations and activities.`,
        image: aboutUs,
    },
    {
        header: `How it works`,
        text: <Fragment>
                <Header content='Work hours' size='small' />
                Volunteer hours of your time at a non-profit or within the local community
                <Header content='Log Hours' size='small' />
                Record the hours you have worked and what you have done
                <Header content='Spend Hours' size='small' />
                Redeem your hours within the network
            </Fragment>,
        image: howItWorks,
    },
    {
        header: `Log`,
        text: `You can log the hours you have worked by clicking on the log hours button and picking the organisation from the drop down menu. A moderator from your organisation will need to approve your hours for you to receive them.`,
        image: logHours,
    },
    {
        header: `Spend`,
        text: `Once you receive hours you will be able to spend these with our growing network of supporters who accept them. From cinema tickets to travel subsidiaries. This is a community currency, provided and spend in the community. Become a vendor or patron to help grow the network.`,
        image: spendHours,
    },
    {
        header: `Exchange`,
        text: `You can also exchange hours by sending them directly to an individual as a tip, a token of gratitude or as a payment for some help they have provided. These personal transactions generate a digital receipt that keeps track of actions and exchanges. `,
        image: exchangeHours,
    },
    {
        header: `Keep track of things`,
        text: `Everytime you borrow something, for example a hammer from the toolbox. Record the exchange with a token amount of hours, so users can track down borrowed items easily.`,
        image: keepTrack,
    },
    {
        header: `Our supporters and partners`,
        text: `We would like to thank our partners in helping us develop the project.

        Easa Croatia.
        Rijeka 2020.
        Party for the people.
        `,
        image: supporters,
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
                <Grid.Row centered><Header content={panes[activeIndex].header} /></Grid.Row>
                <Grid.Row>
                    <Grid.Column width={2} verticalAlign='middle'>
                        <Button basic icon='chevron left' onClick={this.onLeftClick} />
                    </Grid.Column>
                    <Grid.Column width={6} verticalAlign='middle'>
                        <p>{panes[activeIndex].text}</p>
                    </Grid.Column>
                    <Grid.Column width={6} verticalAlign='middle'>
                        <Image src={panes[activeIndex].image} />
                    </Grid.Column>
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
        id='infoModal'
        
      >
        <Modal.Content style={{ backgroundColor:'#F5F5DC' }}>
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