import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';
import Input from 'react-validation/build/input';
import { inject, observer } from "mobx-react";
import { required, isAddress, isPercentage} from "./validators"
import swal from 'sweetalert';
import generateElementWithMessage from "../helpers/UIHelper";
import Web3Utils from 'web3-utils'

@inject("Stores")
@inject("PresalePoolService")
@observer
export class CreateComponent extends React.Component {
  constructor(props){
    super(props)
    this.walletStore = props.Stores.walletStore
    this.presalePoolSettings = props.Stores.poolSettingsStore
    this.presalePoolService = props.PresalePoolService

    this.onSubmit = this.onSubmit.bind(this)
    this.onInputValueChange = this.onInputValueChange.bind(this)
    this.onWhitelistChange = this.onWhitelistChange.bind(this)

    this.state = {
      maxAllocation : '',
      maxPerContributor: '',
      minPerContributor: '',
      adminWallet1: '',
      adminWallet2: '',
      adminWallet3: '',
      feePercentage: 0,
      whitelistAddresses: [],
      tokenPrice: 0
    }

    this.state.walletAddress = ''
  }
  onSubmit(e){
    try {
      this.presalePoolSettings.setAdmins([this.state.adminWallet1, this.state.adminWallet2, this.state.adminWallet3]);
      this.presalePoolSettings.setSettings(Web3Utils.toWei(this.state.maxAllocation), Web3Utils.toWei(this.state.maxPerContributor), Web3Utils.toWei(this.state.minPerContributor), this.state.feePercentage, Web3Utils.toWei(this.state.tokenPrice));
      this.presalePoolSettings.setWhitelist(this.state.whitelistAddresses)
      this.presalePoolService.createPool(this.walletStore, this.presalePoolSettings);
    } catch (e) {
      swal({
        content: generateElementWithMessage(e),
        icon: "error",
      })
    }

    e.preventDefault();
  }
  onWhitelistChange(e){
    const addresses = e.target.value.split(',')
    if(addresses!='undefined' && addresses.length!=0)
    {
      this.state.whitelistAddresses = addresses.filter(w => typeof(w)!='undefined')
    }
  }
  onInputValueChange(event) {
    alert(this.props.Stores.web3);
    let stateChange = {}
    stateChange[event.target.id] = event.target.value;
    this.setState(stateChange);
  }
  render () {
    return (
      <div className="container container_bg">

        <div>
          <h1 className="title"><strong>Create Pool</strong></h1>
          <Form className="form" onSubmit={this.onSubmit}>
          <div className="form-content">
          <div className="content">
            <h5 className="header-2"><strong>Allocation</strong></h5>
            <div className="form-inline">
            <p className="description">
            You have the option to define how big your pool can grow in ethereum
              value. Also, you may define minimum and maximum contributions from
              each contributor. PrimaBlock does not enforce any max or mins.
            </p>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Maximum Allocation (ETH)</label>
              <Input type="number" className="input" id="maxAllocation" value={this.state.maxAllocation} onChange ={this.onInputValueChange} validations={[required]}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
            <div className="Ether-input">
              <div className="half-content">
              <label htmlFor="max-contrib" className="Maximum-Per-Contributor-ETH">Maximum Per Contributor (ETH)</label>
              <Input type="number" className="input" id="maxPerContributor" value={this.state.maxPerContributor} onChange ={this.onInputValueChange} validations={[required]}/>
              </div>
              <div className="half-content">
              <label htmlFor="min-contrib" className="Maximum-Per-Contributor-ETH">Minimum Per Contributor (ETH)</label>
              <Input type="number" className="input" id="minPerContributor" value={this.state.minPerContributor} onChange ={this.onInputValueChange} validations={[required]}/>
              </div>
            </div>
            </div>
            <h5 className="header-2"><strong>Exchange Rate</strong></h5>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Price Per Token (ETH)</label>
              <Input type="number" className="input" id="tokenPrice" value={this.state.tokenPrice} onChange ={this.onInputValueChange} validations={[required]}/>
            </div>
            <h5 className="header-2"><strong>Admins</strong></h5>
            <div className="form-inline">
            <p className="description">
            You have the option to define how big your pool can grow in ethereum
            value. Also, you may define minimum and maximum contributions from
            each contributor. PrimaBlock does not enforce any max or mins.
            </p>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 1 Wallet Address</label>
              <Input className="input" id="adminWallet1" value={this.state.adminWallet1} onChange ={this.onInputValueChange} validations={[isAddress]}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 2 Wallet Address</label>
              <Input className="input" id="adminWallet2" value={this.state.adminWallet2} onChange ={this.onInputValueChange} validations={[isAddress]}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 3 Wallet Address</label>
              <Input className="input" id="adminWallet3" value={this.state.adminWallet3} onChange ={this.onInputValueChange} validations={[isAddress]}/>
            </div>
            </div>
            <div className="content">
            <h5 className="header-2"><strong>Whitelist</strong></h5>
            <div className="form-inline">
            <p className="description">
            You may decide whether to enforce a whitelist, in which case only
            contributors on the list may contribute in your pool. If you click Yes, you
            will specify the addresses after launch. Read more about whitelist gas
            prices in our FAQ.
            </p>
            </div>
            <div className="form-inline">
            <Textarea
              data-gram
              className="textarea"
              onChange={this.onWhitelistChange} className="textarea"></Textarea>
            </div>

            <h5 className="header-2"><strong>Fees</strong></h5>
            <div className="form-inline">
            <p className="description">
            You may charge your contributors a fee for the hard work and value
            that you bring to them. PrimaBlock’s fee is fixed at 0,5%
            </p>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Pool Percentage</label>
              <Input type="number" className="input" id="feePercentage" value={this.state.feePercentage} onChange ={this.onInputValueChange} validations={[required, isPercentage]}/>
            </div>

            <h5 className="header-2"><strong>Token Distribution</strong></h5>
            <div className="form-inline">
            <p className="description">
            You can elect to have PrimaBlock automatically distribute tokens to the
            contributors of your pool. Otherwise, each of your contributors will
            have to claim their tokens from the pool by clicking on the
            'GET MY TOKENS' button.
            </p>
            </div>
            <label htmlFor="token-address" className="label">Presale Pool Address</label>
            <label htmlFor="network" className="walletAddress">{this.presalePoolSettings.presalePoolAddress}</label>
            <Button className="button button_next">Submit</Button>
            </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
