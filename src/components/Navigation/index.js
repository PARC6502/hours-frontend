import React, { Fragment } from "react";
import { Menu, Button, Sidebar, Responsive, Icon } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";

import SearchMembers from "./SearchMembers";
import AccountDropdown from "./AccountDropdown";
import { FirebaseAuthUserContext } from "../Session/FirebaseAuthUserProvider";
import * as routes from "../../constants/routes";

// const Navigation = () =>
//     <FirebaseAuthUserContext.Consumer>
//         {user => user.isUserSignedIn && !user.pendingUser ? <NavigationAuth user={user} /> : <NavigationNonAuth />}
//     </FirebaseAuthUserContext.Consumer>

// const NavigationAuth = (props) => {
//     const isAdmin = props.user.role === 'ADMIN';

//     return (
//         <Menu stackable>
//         <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
//         <Menu.Item as={NavLink} to={routes.ADD_HRS}>Log Hrs</Menu.Item>
//         <Menu.Item as={NavLink} to={routes.SEND_HRS}>Send Hrs</Menu.Item>
//         <Menu.Item as={NavLink} to={routes.PROFILE}>Your Profile</Menu.Item>
//         {isAdmin ? <Menu.Item as={NavLink} to={routes.ADMIN_PAGE}>Admin Page</Menu.Item> : null}
//         <Menu.Menu position='right'>
//             <SearchMembers className="right aligned item" />
//             <AccountDropdown user={props.user} />
//             {/* <Menu.Item><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item> */}
//         </Menu.Menu>
//     </Menu>
//     )
// }

// const NavigationNonAuth = () =>
//     <Menu>
//         <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>Homepage</Menu.Item>
//         <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item>
//         <Menu.Item position='right' fitted>
//             <Button as={NavLink} to={routes.SIGN_UP} fluid primary>Sign up</Button>
//         </Menu.Item>
//     </Menu>

const NonAuthMenuItems = () => (
  <Fragment>
    <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>
      Homepage
    </Menu.Item>
    <Menu.Item as={NavLink} to={routes.ABOUT_PAGE}>About</Menu.Item>
    <Menu.Item as={NavLink} to={routes.SIGN_IN}>Sign in</Menu.Item>
    <Menu.Item position="right" fitted>
      <NavLink to={ routes.SIGN_UP } >
        <Button fluid primary>
          Sign up
        </Button>
      </NavLink>
    </Menu.Item>
  </Fragment>
);

const AuthMenuItems = props => {
  const isAdmin = props.user.role === "ADMIN";

  return (
    <Fragment>
      <Menu.Item exact as={NavLink} to={routes.HOME_PAGE}>
        Homepage
      </Menu.Item>
      <Menu.Item as={NavLink} to={routes.ADD_HRS}>
        Log impact
      </Menu.Item>
      { /* <Menu.Item as={NavLink} to={routes.SEND_HRS}>
        Send{" "}
      </Menu.Item> */ }
      <Menu.Item as={NavLink} to={routes.PROFILE}>
        Your Profile
      </Menu.Item>
      {isAdmin ? (
        <Menu.Item as={NavLink} to={routes.ADMIN_PAGE}>
          Admin Page
        </Menu.Item>
      ) : null}
      <Menu.Menu position="right">
        <SearchMembers className="right aligned item" />
        <AccountDropdown user={props.user} />
        {/* <Menu.Item><Button onClick={auth.doSignOut}>Log out</Button></Menu.Item> */}
      </Menu.Menu>
    </Fragment>
  );
};

const MenuItems = () => (
  <FirebaseAuthUserContext.Consumer>
    {user =>
      user.isUserSignedIn && !user.pendingUser ? (
        <AuthMenuItems user={user} />
      ) : (
        <NonAuthMenuItems />
      )
    }
  </FirebaseAuthUserContext.Consumer>
);

const SidebarMenu = props => (
  <Sidebar
    as={Menu}
    animation="overlay"
    vertical
    visible={props.visible}
    onHide={props.onHide}
    width="thin"
  >
    <MenuItems />
  </Sidebar>
);

const BarMenu = () => (
  <Menu fixed="top">
    <MenuItems />
  </Menu>
);

class ResponsiveNavigation extends React.Component {
  state = {
    sidebarActive: false
  };

  componentDidUpdate(prevProps) {
    const locationChanged = prevProps.location !== this.props.location;
    if (locationChanged) this.hideSidebar();
  }

  handleButtonClick = () =>
    this.setState(prevState => ({ sidebarActive: !prevState.sidebarActive }));

  hideSidebar = () => this.setState({ sidebarActive: false });

  render() {
    return (
      <Fragment>
        <Responsive {...Responsive.onlyMobile}>
          <Menu fluid icon size="massive" borderless fixed="top">
            <Menu.Item onClick={this.handleButtonClick} position="right">
              <Icon name="bars" />
            </Menu.Item>
          </Menu>
          <SidebarMenu
            visible={this.state.sidebarActive}
            onHide={this.hideSidebar}
          />
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <BarMenu />
        </Responsive>
      </Fragment>
    );
  }
}

const ResponsiveNavigationWithRouter = withRouter(ResponsiveNavigation);

export default ResponsiveNavigationWithRouter;
