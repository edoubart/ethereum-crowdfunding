import Web3 from 'web3';

function isBrowser() {
  return typeof window !== 'undefined';
}

function isMetamask() {
  return window && typeof window.web3 !== 'undefined';
}

let web3;

if (isBrowser() && isMetamask()) {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server OR the user is not running metamask.
  const provider = new Web3.providers.HttpProvider(
    //`${process.env.NETWORK_URL}/${process.env.NETWORK_ACCESS_TOKEN}`
    `https://rinkeby.infura.io/vyQ2eo6g0DFcOQqh08Lv`
  );

  web3 = new Web3(provider);
}

export default web3;
