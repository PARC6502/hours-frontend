This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Hours

## Intro

Hours is a time-based currency project under development at Foodhall in Sheffield. The goal is to, eventually, have a decentralised system for distributing a currency based on hours contributed to the community and be able to exchange those for services and goods from the community.

## Project Structure
The project currently has 5 components, all found in `/src/`:

* `App`: Organises other components, and sets up the routing
* `Dashboard`: Is at the top of every page. If the user is logged in, has links for logging hours and sending hours
* `TimeLoggingForm`: Form for logging time/activities
* `SendHrsForm`: Form for paying for things using hours
* `HomePage`: Currently just a placeholder, will have the homepage 

## TODO
There is lots and lots to do, but here's stuff I will work on imminently:
* Redux integration: have state managed by redux
* Log in/sign up: users are able to log in and sign up. `loggedin` state affects how app behaves
* Homepage 
* Data structure: How will the data be organised? (I think I will need RDBMS - Postgres?)
* Database: Best to use DaaS so I can host static site? Might not be possible as this app gets more complex