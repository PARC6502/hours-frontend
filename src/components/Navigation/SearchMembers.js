import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import { db } from '../../firebase';

//will have to implement algolia or elasticsearch....
class SearchMembers extends Component {
    state = {
        isLoading: false,
        members: [],
        value: '',
        results: [],
    }

    componentDidMount() {
        this.resetComponent()

        db.getUsers()
        .then(users => {
            const usersWithType = users.map(({ name, id }) => ({ title: name, value: id, description: 'User' }))
            this.setState(prevState => {
                const { members } = prevState;
                members.push(...usersWithType);
                return { ...prevState, members }
            })
            return db.getOrganisations();
        })
        .then(orgs => {
            const orgsWithType = orgs.map(({ name, id }) => ({ title: name, value: id, description: 'Organisation' }))
            this.setState(prevState => {
                const { members } = prevState;
                members.push(...orgsWithType);
                return { ...prevState, members }
            })
        })
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        const { history } = this.props;
        const { value, description } = result;
        if (description === "User")
            history.push(`/user/${value}`);
        else if (description === "Organisation")
            history.push(`/organisation/${value}`)
        this.resetComponent();
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.setState({
              isLoading: false,
              results: _.filter(this.state.members, isMatch),
            })
          }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state;

        return (
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
                className={this.props.className}
            />
        )
    }
}

export default withRouter(SearchMembers)
