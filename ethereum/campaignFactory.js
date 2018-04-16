import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x68F551EF7356C909848F21d35dF07f8233A45Ec6'
);

export default instance;
