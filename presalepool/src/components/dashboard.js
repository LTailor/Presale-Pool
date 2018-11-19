import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import { inject, observer } from "mobx-react";
import { required, isAddress, isPercentage} from "./validators"
import Web3Utils from 'web3-utils'
import { Line } from 'rc-progress';
import { observable } from "mobx";

const qs = require('query-string');


@inject("ContributorService")
@observer
export class DashboardComponent extends React.Component {
  @observable contributionPercentage = 0
  constructor(props){
    super(props);
    this.contributorService = props.ContributorService;

    this.contributorService.init(qs.parse(this.props.location.search).pool_address).then(()=>{
      if(this.contributorService.contribution>0)
      {
        this.contributionPercentage = new Web3Utils.BN(this.contributorService.maxPerContributor).div(new Web3Utils.BN(this.contributorService.contribution)).toString() // check for 0
        this.contributionPercentage = 100 / parseInt(this.contributionPercentage)
      }
    })

    this.onContribute = this.onContribute.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.onGetTokens = this.onGetTokens.bind(this);
    this.state = {
      maxContirbution : this.contributorService.maxContribution,
      minContribution: this.contributorService.minContribution,
      maxAllocation: this.contributorService.maxAllocation,
      contributorAddress: this.contributorService.contributorAddress,
      tokenAddress: ''
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

  onGetTokens(e)
  {
    this.contributorService.getTokens(this.state.tokenAddress)
    e.preventDefault();
  }

  onInputValueChange(event) {
    this.setState({[event.target.id]: event.target.value });
  }

  render () {
    return (

      <div className="container container_bg">


        <div className="form-content">
        <div className="content-70">
        <div className="form-inline-i form-inline-i_token-address">
          <label htmlFor="token-address" className="label">My Wallet Address</label>
          <label htmlFor="network" className="walletAddress">{this.contributorService.contributorAddress}</label>
        </div>
        <Form>

              <div className="form-inline-i form-inline-i_token-address">
                <h5 className="header-2"><strong>My Contribution</strong></h5>
                <div className="form-inline">
                  <p className="send-info-amount">{this.contributorService.contributionInEther} ETH</p>
                </div>
                <div className="form-inline">
                  <p className="">Real Value:</p>
                  <p className="ether-value">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.realValue))} ETH</p>
                </div>
                <div className="form-inline">
                  <p className="">Fees:</p>
                  <p className="ether-value">{this.contributorService.poolFee} %</p>
                </div>
              </div>
              <div className="form-inline">
                <div className="progressbar"><Line percent="10" strokeWidth="4" strokeColor="#10b3ff" trailColor="#1f3444" trailWidth="2" strokeWidth="2"/></div>
              </div>
              <div>
                <div>
                  <label htmlFor="token-address" className="label">Ether Value</label>
                  <Input type="number" className="input" id="etherValue" value={this.state.etherValue} onChange ={this.onInputValueChange} validations={[required]}/>
                </div>
                <div>
                  <Button className="button_contrib" onClick={this.onContribute}><p>Contribute Ether</p></Button>
                </div>
              </div>
              <div className="form-inline">
                <Button className="button_withdraw" onClick={this.onWithdraw}><p>Withdraw Ether</p></Button>
              </div>

          </Form>
          <Form>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Token Address </label>
            <Input className="input" id="tokenAddress" value={this.state.tokenAddress} onChange ={this.onInputValueChange}/>
          </div>
          <div className="form-inline">
              <Button className="button_contrib" onClick={this.onGetTokens}><p>Get Tokens</p></Button>

          </div>
          </Form>
          </div>
        </div>

          <div className="content-r"></div>
          <div className="content-30">
            <div className="form-inline-i form-inline-i_token-address">
              <h5 className="header-2"><strong>Allocation</strong></h5>
              <label htmlFor="token-address" className="label">Total pool allocation</label>
              <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.maxAllocation),'ether').toString()} ETH</label>

              <label htmlFor="token-address" className="label">Max per contributor</label>
              <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.maxPerContributor),'ether').toString()} ETH</label>

              <label htmlFor="token-address" className="label">Min per contributor</label>
              <label htmlFor="network" className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.minPerContributor),'ether').toString()} ETH</label>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <h5 className="header-2"><strong>Pool Value</strong></h5>
              <label className="walletAddress">{Web3Utils.fromWei(new Web3Utils.BN(this.contributorService.poolValue),'ether').toString()} ETH</label>
            </div>
          </div>
      </div>
    );
  }
}
