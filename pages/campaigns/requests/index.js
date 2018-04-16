// React
import React, { Component } from 'react';

// Next Routes
import { Link } from '../../../routes';

// Semantic UI
import { Button, Table } from 'semantic-ui-react';

// Custom
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';

// Ethereum
import Campaign from '../../../ethereum/campaign';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestsCount, approversCount };
  }

  // Renderers
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          address={this.props.address}
          approversCount={this.props.approversCount}
          id={index}
          key={index}
          request={request}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    let route = `/campaigns/${this.props.address}/requests/new`;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={route}>
          <a>
            <Button
              floated="right"
              primary
              style={{ marginBottom: 10 }}
            >
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approval</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            { this.renderRows() }
          </Body>
        </Table>
        <div>Found { this.props.requestsCount } requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
