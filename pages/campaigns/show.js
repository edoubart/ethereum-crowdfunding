// React
import React, { Component } from 'react';

// Next Routes
import { Link } from '../../routes';

// Semantic UI
import {
  Button,
  Card,
  Grid
} from 'semantic-ui-react';

// Custom
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';

// Ethereum
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignShow extends Component {

  // Next Lifecycle hook
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  // Renderers
  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: `
          The manager created this campaign and can create requests to withdraw\
          money.
        `,
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: `
          You must contribute at least this much wei to become an approver.
        `,
        style: { overflowWrap: 'break-word' }
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description: `
          A request tries to withdraw money from the contract. Requests must be\
          approved by approvers.
        `,
        style: { overflowWrap: 'break-word' }
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: `
          Number of people who already have donated to.
        `,
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: "Campaign's Balance (ether)",
        description: `
          The balance is how much money this campaign has left to spend.
        `,
        style: { overflowWrap: 'break-word' }
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    let route = `/campaigns/${this.props.address}/requests`;

    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              { this.renderCards() }
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={route}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
