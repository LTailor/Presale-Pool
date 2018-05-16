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
    this.presalePoolService.init(this.walletStore, undefined);
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
            <Button className="button button_next">Submit</Button>
          </Form>

        </div>
      </div>
    );
  }
}
