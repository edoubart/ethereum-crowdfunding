const Web3 = require('web3');
const assert = require('assert');
const ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());

const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');

const GAS = '1000000';

let accounts;
let campaign;
let campaignAddress;
let campaignFactory;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(
      JSON.parse(compiledCampaignFactory.interface)
    )
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ from: accounts[0], gas: GAZ });

  await campaignFactory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: GAZ });

  [campaignAddress] = await campaignFactory.methods
    .getDeployedCampaigns()
    .call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a campaign factory and a campaign', () => {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approver', async () => {
    await campaign.methods.contribute()
      .send({ from: accounts[1], value: '200' });

    isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute()
        .send({ from: accounts[1], value: '5' });

      assert(false);
    } catch(error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
      .send({ from: accounts[0], gas: GAZ });

    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute()
      .send({ from: accounts[0], value: web3.utils.toWei('10', 'ether') });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: GAZ });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: GAZ
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: GAZ
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    console.log(balance);
    assert(balance > 104);
  });
});
