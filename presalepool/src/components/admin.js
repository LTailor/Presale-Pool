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
const qs = require('query-string')

@inject("Stores")
@inject("PresalePoolService")
@observer
export class AdminComponent extends React.Component {
  constructor(props){
    super(props);
    this.presalePoolSettings = props.Stores.poolSettingsStore
    this.presalePoolService = props.PresalePoolService
    this.presalePoolSettings.presalePoolAddress = qs.parse(this.props.location.search).pool_address
    this.presalePoolService.init(this.presalePoolSettings)
  }

  render () {
    return (
      <div className="container container_bg">

        <div>
        <h1 className="title"><strong>Pool Admin</strong></h1>
        <div className="form-inline-i form-inline-i_token-address">
          <label className="label">Pool Smart Contract Address</label>
          <label className="walletAddress">{this.presalePoolSettings.presalePoolAddress}</label>
        </div>
        <Form className="form" onSubmit={this.onSubmit}>
        <div className="form-content">
        <div className="content">
          <h5 className="header-2"><strong>Allocation</strong></h5>
          <div className="form-inline">
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Maximum Allocation (ETH)</label>
            <Input type="number" className="input" id="maxAllocation" value={Web3Utils.fromWei(this.presalePoolSettings.maxAllocation.toString()).toString()} onChange ={this.onInputValueChange} validations={[required]}/>
          </div>
          <div className="form-inline-i form-inline-i_token-address">
          <div className="Ether-input">
            <div className="half-content">
            <label htmlFor="max-contrib" className="Maximum-Per-Contributor-ETH">Maximum Per Contributor (ETH)</label>
            <Input type="number" className="input" id="maxPerContributor" value={this.presalePoolSettings.maxPerContributor} onChange ={this.onInputValueChange} validations={[required]}/>
            </div>
            <div className="half-content">
            <label htmlFor="min-contrib" className="Maximum-Per-Contributor-ETH">Minimum Per Contributor (ETH)</label>
            <Input type="number" className="input" id="minPerContributor" value={this.presalePoolSettings.minPerContributor} onChange ={this.onInputValueChange} validations={[required]}/>
            </div>
          </div>
          </div>
          <h5 className="header-2"><strong>Admins</strong></h5>
          <div className="form-inline">
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Admin 1 Wallet Address</label>
            <Input className="input" id="adminWallet1"  />
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Admin 2 Wallet Address</label>
            <Input className="input" id="adminWallet2" />
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Admin 3 Wallet Address</label>
            <Input className="input" id="adminWallet3"/>
          </div>
          </div>
          <div className="content">
          <h5 className="header-2"><strong>Whitelist</strong></h5>
          <div className="form-inline">
         <Textarea
            data-gram
            className="textarea"
             className="textarea"></Textarea>
          </div>

          <h5 className="header-2"><strong>Fees</strong></h5>
          <div className="form-inline">
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <label htmlFor="token-address" className="label">Pool Percentage</label>
            <Input type="number" className="input" id="feePercentage" value={this.presalePoolSettings.feePercentage} onChange ={this.onInputValueChange} validations={[required, isPercentage]}/>
          </div>

          <h5 className="header-2"><strong>Token Distribution</strong></h5>
          <div className="form-inline">
          </div>
          <Button className="button">Submit</Button>
          </div>
          </div>
        </Form>
        </div>
      </div>
    );
  }
}
