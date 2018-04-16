// React
import React, { Component } from 'react';

// Next Routes
import { Router } from '../routes';

// Semantic UI
import {
  Button,
  Form,
  Input,
  Message
} from 'semantic-ui-react';

// Ethereum
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {
  state= {
    errorMessage: '',
    loading: false,
    value: ''
  };

  // Handlers
  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);

    this.setState({ errorMessage: '', loading: true });

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            onChange={event => this.setState({ value: event.target.value })}
            value={this.state.value}
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading={this.state.loading} primary>Contribute!</Button>
      </Form>
    );
  }
}

export default ContributeForm;
