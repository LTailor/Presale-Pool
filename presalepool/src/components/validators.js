import React from 'react';
import Web3Utils from 'web3-utils'

const required = (value) => {
  if (!value.toString().trim().length) {
    return <span>Required</span>;
  }
};

const isAddress = (value) => {
  if (!Web3Utils.isAddress(value)) {
    return <span>Wallet address is invalid</span>;
  }
};

const isPercentage = (value) => {
  if (value > 100 || value < 0) {
    return <span>Percentage is not correct</span>;
  }
};

export {required, isAddress, isPercentage}
