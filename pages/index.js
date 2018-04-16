// React
import React, { Component } from 'react';

// Next Routes
import { Link } from '../routes';

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
      let route = `/campaigns/${address}`;

      return {
        header: address,
        description: (
          <Link route={route}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>

        <Link route="/campaigns/new">
          <a>
            <Button
              content="Create Campaign"
              floated="right"
              icon="add circle"
              primary
            />
          </a>
        </Link>

        { this.renderCampaigns() }
      </Layout>
    );
  }
}

export default CampaignIndex;
