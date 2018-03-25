pragma solidity ^0.4.0;

contract Campaign {
  struct Request {
    bool complete;
    string description;
    address recipient;
    uint value;
    uint voteCount;
    mapping(address => bool) votes;
  }
  
  mapping(address => bool) public approvers;
  uint public approversCount;
  address public manager;
  uint public minimumContribution;
  Request[] public requests;

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
  
  function Campaign(uint minimum, address creator) public {
    manager = creator;
    minimumContribution = minimum;
  }
  
  function approveRequest(uint index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender]);
    require(!request.votes[msg.sender]);

    request.votes[msg.sender] = true;
    request.voteCount++;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    
    approvers[msg.sender] = true;
    approversCount++;
  }
  
  function createRequest(
    string description,
    uint value,
    address recipient
  ) public restricted {
    //require(approvers[msg.sender]);

    Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false,
      voteCount: 0
    });

    requests.push(newRequest);
  }

  function finalizeRequest(uint index) public restricted {
    Request storage request = requests[index];

    require(request.voteCount > (approversCount / 2));
    require(!request.complete);

    request.recipient.transfer(request.value);
    request.complete = true;
  }
}

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint minimum) public {
    address newCampaign = new Campaign(minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}
