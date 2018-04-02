// React
import React, { Component } from 'react';

// Semantic UI
import {
  Button,
  Form,
  Input
} from 'semantic-ui-react';

// Custom
import Layout from '../../components/Layout';

// Ethereum
import campaignFactory from '../../ethereum/campaignFactory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
  state = {
    contribution: ''
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    await campaignFactory.methods.createCampaign(this.state.contribution)
      .send({
        from: accounts[0]
      });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit}>
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

          <Button primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
