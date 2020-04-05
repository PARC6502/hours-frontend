import React, { Component, Fragment } from "react";
import { Grid, Button, Image, Modal, Header } from "semantic-ui-react";
import Swipeable from "react-swipeable";

import aboutUs from "../images/jumpyHours.png";
import keepTrack from "../images/ToolExchange.png";
import howItWorks from "../images/helping.png";
import logHours from "../images/logHours.png";
import spendHours from "../images/shopSupport.png";
import exchangeHours from "../images/greatTime.png";
import supporters from "../images/supporters.png";
import { Icon, Label } from "semantic-ui-react";

import { FirebaseAuthUserContext } from "./Session/FirebaseAuthUserProvider";

const infoPanes = [
  {
    header: `Mutual impact`,
    text: `Mutual impact is a feed for groups to post impact at the end of the day or week. Having more information during COVID-19 gives each group more context, which helps us carry out work more effectively. It also supports researchers to compile evidence for to government to unlock support.`,
    image: aboutUs
  },
  {
    header: `How it works`,
    text: (
      <Fragment>
        <Header content="Help people" size="small" />
        Help people in your community.
        <Header content="Post your impact" size="small" />
        Post your impact on the newsfeed.
        <Header content="Evidence impact." size="small" />
        We hope this tool will provide an easy framework for mutualist groups to
        achieve support for their work.
      </Fragment>
    ),

    image: howItWorks
  },
  {
    header: `How to post impact`,
    text: `Click log impact. Post your general stats such as the number of people you helped and how you helped them. Include as much as you can but don't post any sensitive information! Duh! `,
    image: logHours
  },
  {
    header: `Real time transparency`,
    text: ` Keep it updated and get your team to post as often as you can. Try not to repeat information! Check your groups total in the search bar and you will quickly be surprised!`,
    image: keepTrack
  },
  {
    header: `Share`,
    text: `People can see how you are doing. This allows organisations, individuals, and municipals to work out how to best support you.`,
    image: spendHours
  },
  {
    header: `Share`,
    text: `As a novel feature, you can send impact to an individual as a token of gratitude. We are developing these features as the project evolves. `,
    image: exchangeHours
  },
  {
    header: `Our supporters and partners`,

    text: (
      <Fragment>
        <Header content="Who is making this" size="small" />
        This system is designed by members of the National Food Service
        campaign, a grassroots network to end food insecurity in the U.K. We are
        looking for more contributors, so if you would like to help build this
        app or for more information visit the
        <a href="https://www.nationalfoodservice.uk/">
          {" "}
          National Food Service website
        </a>
      </Fragment>
    ),

    image: supporters
  }
];

class InfoGallery extends Component {
  state = {
    activeIndex: 0
  };

  onLeftClick = () =>
    this.setState(prevState => {
      if (prevState.activeIndex < 1)
        return {
          activeIndex: this.props.panes.length - 1
        };
      return {
        activeIndex: prevState.activeIndex - 1
      };
    });

  onRightClick = () =>
    this.setState(prevState => {
      if (prevState.activeIndex > this.props.panes.length - 2)
        return {
          activeIndex: 0
        };
      return {
        activeIndex: prevState.activeIndex + 1
      };
    });

  onButtonClick = (e, { name }) => this.setState({ activeIndex: name });

  render() {
    const { panes } = this.props;
    const { activeIndex } = this.state;
    return (
      <Grid
        as={Swipeable}
        onSwipedLeft={this.onRightClick}
        onSwipedRight={this.onLeftClick}
        stackable
      >
        <Grid.Row style={{ minHeight: "362px" }} reversed="mobile vertically">
          <Grid.Column width={2} verticalAlign="middle" only="computer">
            <Button basic icon="chevron left" onClick={this.onLeftClick} />
          </Grid.Column>
          <Grid.Column width={6} stretched>
            <Header content={panes[activeIndex].header} size="huge" />
            <p>{panes[activeIndex].text}</p>
          </Grid.Column>
          <Grid.Column width={6} verticalAlign="middle">
            <Image src={panes[activeIndex].image} />
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle" only="computer">
            <Button basic icon="chevron right" onClick={this.onRightClick} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          {panes.map((_pane, index) => (
            <Button
              key={`button-${index}`}
              name={index}
              basic={activeIndex === index}
              onClick={this.onButtonClick}
              circular
              icon
              color="black"
              size="mini"
              style={{ padding: "0.6em", fontSize: "0.6em" }}
            />
          ))}
        </Grid.Row>
      </Grid>
    );
  }
}

class InfoModal extends Component {
  state = {
    modalOpen: false,
    wasSignedIn: false
  };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  componentDidMount() {
    const { user } = this.props;
    if (user.isUserSignedIn) this.setState({ wasSignedIn: true });
    if (!user.isUserSignedIn && !user.pendingAuth && !this.state.wasSignedIn)
      this.handleOpen();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user === this.props.user) return;
    const { user } = this.props;
    if (user.isUserSignedIn) this.setState({ wasSignedIn: true });
    if (!user.isUserSignedIn && !user.pendingAuth && !this.state.wasSignedIn)
      this.handleOpen();
  }

  render() {
    const { user } = this.props;
    const { modalOpen, alreadyShown } = this.state;

    if (user.isUserSignedIn || alreadyShown) return null;

    return (
      <Modal
        open={modalOpen}
        onClose={this.handleClose}
        size="small"
        closeIcon
        id="infoModal"
      >
        <Modal.Content style={{ backgroundColor: "#FFFF" }}>
          <InfoGallery panes={infoPanes} />
        </Modal.Content>
      </Modal>
    );
  }
}

const InfoModalWithUser = () => (
  <FirebaseAuthUserContext.Consumer>
    {user => <InfoModal user={user} />}
  </FirebaseAuthUserContext.Consumer>
);

export default InfoModalWithUser;
