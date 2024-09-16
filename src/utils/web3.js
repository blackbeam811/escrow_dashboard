import Web3 from 'web3';

export function getLibrary(provider) {
    return new Web3(provider);
  }