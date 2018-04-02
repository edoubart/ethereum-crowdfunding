import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xd2E831E80F412c85C993F061c850d1D6798D2ad0'
);

export default instance;
