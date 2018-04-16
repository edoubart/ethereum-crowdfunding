// React
import React, { Component } from 'react';

// Semantic UI
import { Button, Table } from 'semantic-ui-react';

// Ethereum
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const { approversCount, id, request } = this.props;

    const approvalCount = `${request.voteCount}/${approversCount}`;
    const readyToFinalize = request.voteCount > (approversCount / 2);

    // Handlers
    const onApprove = async () => {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0]
      });
    };

    const onFinalize = async () => {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      });
    };

    // Renderers
    function renderApproveButton() {
      return (
        <Button color="green" basic onClick={onApprove}>
          Approve
        </Button>
      );
    }

    function renderFinalizeButton() {
      return (
        <Button color="teal" basic onClick={onFinalize}>
          Finalize
        </Button>
      );
    }

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{approvalCount}</Cell>
        <Cell>
          { request.complete ? null : renderApproveButton() }
        </Cell>
        <Cell>
          { readyToFinalize ? renderFinalizeButton() : null }
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
