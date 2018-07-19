import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';

import { db } from '../firebase';


//will have to implement algolia or elasticsearch....
class SearchMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            members: [],
            value: [],
            results: [],
        }
        db.getUsers()
        .then(users => {
            this.setState(prevState => {
                const { members } = prevState;
                members.push(...users);
                return { ...prevState, members }
            })
            return db.getOrganisations();
        })
        .then(orgs => {
            this.setState(prevState => {
                const { members } = prevState;
                members.push(...orgs);
                return { ...prevState, members }
            })
        })
    }

    componentWillMount() {
        this.resetComponent()
      }
    
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        if (this.state.value.length < 1) return this.resetComponent()

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = result => re.test(result.title)

        this.setState({
        isLoading: false,
        results: _.filter(this.state.members, isMatch),
        })
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
                {...this.props}
            />
        )
    }
}

export default SearchMembers