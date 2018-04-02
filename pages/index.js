// React
import React, { Component } from 'react';

// Semantic UI
import {
  Button,
  Card,
  Icon
} from 'semantic-ui-react';

// Custom
import Layout from '../components/Layout';

import campaignFactory from '../ethereum/campaignFactory';

class CampaignIndex extends Component {

  // Next Lifecycle hook
  static async getInitialProps() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Button
          content="Create Campaign"
          floated="right"
          icon="add circle"
          primary
        />
        { this.renderCampaigns() }
      </Layout>
    );
  }
}

export default CampaignIndex;
