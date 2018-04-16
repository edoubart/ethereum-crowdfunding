// React
import React, { Component } from 'react';

// Next Routes
import { Link, Router } from '../../../routes';

// Semantic UI
import {
  Button,
  Form,
  Input,
  Message
} from 'semantic-ui-react';

// Custom
import Layout from '../../../components/Layout';

// Ethereum
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class RequestNew extends Component {
  // Local state
  state = {
    description: '',
    errorMessage: '',
    loading: false,
    recipient: '',
    value: ''
  };

  // Next Lifecycle hook
  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  // Handlers
  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    const { description, recipient, value } = this.state;

    this.setState({ errorMessage: '', loading: true });

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.createRequest(
        description,
        web3.utils.toWei(value, 'ether'),
        recipient
      ).send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    let parentRoute = `/campaigns/${this.props.address}/requests`;

    return (
      <Layout>
        <Link route={parentRoute}>
          <a>
            Back
          </a>
        </Link>
        <h3>Create a Request</h3>
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Description</label>
            <Input
              onChange={event => this.setState(
                { description: event.target.value }
              )}
              value={this.state.description}
            />
          </Form.Field>

          <Form.Field>
            <label>Value</label>
            <Input
              onChange={event => this.setState(
                { value: event.target.value }
              )}
              value={this.state.value}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              onChange={event => this.setState(
                { recipient: event.target.value }
              )}
              value={this.state.recipient}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
