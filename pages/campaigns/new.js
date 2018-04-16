// React
import React, { Component } from 'react';

// Next Routes
import { Router } from '../../routes';

// Semantic UI
import {
  Button,
  Form,
  Input,
  Message
} from 'semantic-ui-react';

// Custom
import Layout from '../../components/Layout';

// Ethereum
import campaignFactory from '../../ethereum/campaignFactory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
  // Local state
  state = {
    contribution: '',
    errorMessage: '',
    loading: false
  };

  // Handlers
  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaignFactory.methods.createCampaign(this.state.contribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              onChange={event => this.setState(
                { contribution: event.target.value }
              )}
              value={this.state.contribution}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
