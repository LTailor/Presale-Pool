import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import { inject, observer } from "mobx-react";

@inject("Stores")
@inject("PresalePoolService")
@observer
export class CreateComponent extends React.Component {
  constructor(props){
    super(props);
    this.walletStore = props.Stores.walletStore;
    this.presalePoolSettings = props.Stores.poolSettingsStore;
    this.presalePoolService = props.PresalePoolService;

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);

    this.state = {
      maxAllocation : '',
      maxPerContributor: '',
      minPerContributor: '',
      adminWallet1: '',
      adminWallet2: '',
      adminWallet3: ''
    }

    this.state.walletAddress = '';
  }
  onSubmit(e){
    this.presalePoolSettings.setAdmins([this.state.adminWallet1, this.state.adminWallet2, this.state.adminWallet3]);
    this.presalePoolSettings.setSettings(this.state.maxAllocation, this.state.maxPerContributor, this.state.minPerContributor);
    this.presalePoolService.init(this.walletStore, this.presalePoolSettings);
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

        <div className="content">
          <h1 className="title"><strong>Create Pool</strong></h1>
          <p className="description">
          First we need to collect your ethereum wallet address so that you can
          interact with our smart-contract engine
          </p>
          <Form className="form" onSubmit={this.onSubmit}>
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
              <input type="text" className="input" id="maxAllocation" value={this.state.maxAllocation} onChange ={this.onInputValueChange}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="max-contrib" className="label">Maximum Per Contributor (ETH)</label>
              <input type="text" className="input" id="maxPerContributor" value={this.state.maxPerContributor} onChange ={this.onInputValueChange}/>
              <label htmlFor="min-contrib" className="label">Minimum Per Contributor (ETH)</label>
              <input type="text" className="input" id="minPerContributor" value={this.state.minPerContributor} onChange ={this.onInputValueChange}/>
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
              <input type="text" className="input" id="adminWallet1" value={this.state.adminWallet1} onChange ={this.onInputValueChange}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 2 Wallet Address</label>
              <input type="text" className="input" id="adminWallet2" value={this.state.adminWallet2} onChange ={this.onInputValueChange}/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 3 Wallet Address</label>
              <input type="text" className="input" id="adminWallet3" value={this.state.adminWallet3} onChange ={this.onInputValueChange}/>
            </div>

            <h5 className="header-2"><strong>Whitelist</strong></h5>
            <div className="form-inline">
            <p className="description">
            You may decide whether to enforce a whitelist, in which case only
            contributors on the list may contribute in your pool. If you click Yes, you
            will specify the addresses after launch. Read more about whitelist gas
            prices in our FAQ.
            </p>
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
              <input type="text" className="input" id="adminWallet3" value={this.state.adminWallet3} onChange ={this.onInputValueChange}/>
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


            <Button className="button button_next">Submit</Button>
          </Form>

        </div>
      </div>
    );
  }
}
