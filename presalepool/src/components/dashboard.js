import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import { inject, observer } from "mobx-react";
import Web3Utils from 'web3-utils'
const qs = require('query-string');

@inject("ContributorService")
@observer
export class DashboardComponent extends React.Component {
  constructor(props){
    super(props);
    this.contributorService = props.ContributorService;

    this.contributorService.init(qs.parse(this.props.location.search).pool_address)
    this.onContribute = this.onContribute.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);

    this.state = {
      maxContirbution : this.contributorService.maxContribution,
      minContribution: this.contributorService.minContribution,
      contributorAddress: this.contributorService.contributorAddress
    }
  }

  onContribute(e){
    this.contributorService.contribute(Web3Utils.toWei(this.state.etherValue))
    e.preventDefault();
  }

  onWithdraw(e)
  {
    this.contributorService.withdrawContribution()
    e.preventDefault();
  }

  onInputValueChange(event) {
    let stateChange = {}
    stateChange[event.target.id] = event.target.value;
    this.setState(stateChange);
  }

  render () {
    return (
      <div className="container container_bg">

        <div>
        <div className="form-inline-i form-inline-i_token-address">
          <label htmlFor="token-address" className="label">My Wallet Address</label>
          <label htmlFor="network" className="walletAddress">{this.contributorService.contributorAddress}</label>
        </div>
        <Form>
        <div className="form-content">

        <div className="dashboard-contribtuion-info">
        <div className="form-inline-i form-inline-i_token-address">
          <h5 className="header-2"><strong>My Contribution</strong></h5>
          <div className="form-inline">

                <p className="send-info-amount">{this.contributorService.contributionInEther} ETH</p>
          </div>
          <div className="form-inline">
              <p className="">Fees:</p>
              <p className="description">{this.contributorService.poolFee} %</p>

          </div>
          </div>
          <div className="form-inline">
          <div className="form-inline-i form-inline-i_token-address">
              <Button className="button" onClick={this.onContribute}><p>Contribute Ether</p></Button>

                <label htmlFor="token-address" className="label">Ether Value</label>
                <input type="text" className="input" id="etherValue" value={this.state.etherValue} onChange ={this.onInputValueChange}/>
          </div>
          <div className="form-inline-i form-inline-i_token-address">
              <Button className="button" onClick={this.onWithdraw}><p>Withdraw Ether</p></Button>

          </div>
          </div>
          </div>
          <div>
          <div className="form-inline-i form-inline-i_token-address">
            <h5 className="header-2"><strong>Allocation</strong></h5>
            <label htmlFor="token-address" className="label">Total pool allocation</label>
            <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.maxAllocation),'ether').toString()}</label>

            <label htmlFor="token-address" className="label">Max per contributor</label>
            <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.maxPerContributor),'ether').toString()}</label>

            <label htmlFor="token-address" className="label">Min per contributor</label>
            <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.minPerContributor),'ether').toString()}</label>
            </div>
          <div className="form-inline-i form-inline-i_token-address">

          </div>
          </div>
          </div>
        </Form>
        </div>
      </div>
    );
  }
}
