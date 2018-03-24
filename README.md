This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Hours

## Intro

Hours is a time-based currency project under development at Foodhall in Sheffield. The goal is to, eventually, have a decentralised system for distributing a currency based on hours contributed to the community and be able to exchange those for services and goods from the community.

## Project Structure
The project currently has 3 components, all found in `/src/`: `App`, `Dashboard` and `TimeLoggingForm`.

* `App`: Organises other components for display
* `Dashboard`: Contains user information
* `TimeLoggingForm`: Form for logging time

## TODO
There is lots and lots to do, but here's stuff I will work on imminently:
* Data structure: How will the data be organised? (I think I will need RDBMS - Postgres?)
* Database: Best to use DaaS so I can host static site? Might not be possible as this app gets more complex
* User Information: Displays recent contributions, project affiliations, etc
* Routing
* Everything else