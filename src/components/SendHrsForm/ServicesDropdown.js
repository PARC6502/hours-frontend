class ServicesDropdown extends Component {
    state = {
      value: this.props.value,
      services: [],
    };
  
    onChange = (evt, {name, value}) => {
      this.setState({ value });
      this.props.onChange(evt, {name, value});
    }
  
    componentWillReceiveProps(update) {
      this.setState({ value: update.value });
    }
  
    componentDidMount() {
      this.setState({ services: databaseController.getServices() });
    }
  
    render() {
      const serviceOptions = this.state.services.map(service => (
        {
          text: `${service.name} - ${service.cost} hrs`,
          value: service.id,
        }));
      return (
        <Form.Select 
          name="service" 
          fluid search selection
          label="Pick a service, or product, from the dropdown"
          placeholder="Select a service..." 
          options={serviceOptions}
          value={this.state.value} 
          onChange={this.onChange} />
      )
    }
  }