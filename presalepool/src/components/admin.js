import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';
import Input from 'react-validation/build/input';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { required, isAddress, isPercentage} from "./validators"
import swal from 'sweetalert';
import generateElementWithMessage from "../helpers/UIHelper";
import Web3Utils from 'web3-utils'
const qs = require('query-string')

@inject("Stores")
@inject("PresalePoolService")
@observer
export class AdminComponent extends React.Component {

  @observable defaultAccount = ''
  @observable poolValues = {
    maxAllocation : '',
    maxPerContributor: '',
    minPerContributor: '',
    adminWallet1: '',
    adminWallet2: '',
    adminWallet3: '',
    feePercentage: '',
    whitelistAddresses: [],
    status: '',
    tokenAddress: ''
  }
  constructor(props){
    super(props);
    this.presalePoolSettings = props.Stores.poolSettingsStore
    this.presalePoolService = props.PresalePoolService
    this.presalePoolSettings.presalePoolAddress = qs.parse(this.props.location.search).pool_address

    this.onSubmit = this.onSubmit.bind(this)
    this.onInputValueChange = this.onInputValueChange.bind(this)
    this.onWhitelistChange = this.onWhitelistChange.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onTransfer = this.onTransfer.bind(this)
    this.onSendContribution = this.onSendContribution.bind(this)
    const configPromise = this.presalePoolService.init(this.presalePoolSettings)

    configPromise.then(config => {
      this.defaultAccount = this.presalePoolService.defaultAccount
      this.poolValues = {
        maxAllocation : Web3Utils.fromWei(this.presalePoolSettings.maxAllocation.toString()),
        maxPerContributor: Web3Utils.fromWei(this.presalePoolSettings.maxContribution.toString()),
        minPerContributor: Web3Utils.fromWei(this.presalePoolSettings.minContribution.toString()),
        adminWallet1: this.presalePoolSettings.admins[0],
        adminWallet2: this.presalePoolSettings.admins[1],
        adminWallet3: this.presalePoolSettings.admins[2],
        feePercentage: this.presalePoolSettings.feePercentage,
        whitelistAddresses: this.presalePoolSettings.whitelistAddresses.join(','),
        tokenPrice: Web3Utils.fromWei(this.presalePoolSettings.tokenPrice),
        status:'',
        tokenAddress:'',
        contribData:''
      }
      this.showPoolStatus()
    })
  }

  showPoolStatus()
  {
    let status=''
    switch (this.presalePoolSettings.status)
    {
      case '0':
        status = 'Opened'
        break
      case '1':
        status = 'Closed'
        break
      case '2':
        status = 'Paid'
        break
      case '3':
        status = 'Transfered'
        break
    }

    this.poolValues.status = status
  }

  onSubmit(e){
    this.presalePoolSettings.setAdmins([this.poolValues.adminWallet1, this.poolValues.adminWallet2, this.poolValues.adminWallet3]);
    this.presalePoolSettings.setSettings(Web3Utils.toWei(this.poolValues.maxAllocation), Web3Utils.toWei(this.poolValues.maxPerContributor), Web3Utils.toWei(this.poolValues.minPerContributor), this.poolValues.feePercentage, Web3Utils.toWei(this.poolValues.tokenPrice));
    this.presalePoolSettings.setWhitelist(this.poolValues.whitelistAddresses)
    this.presalePoolService.save()
    e.preventDefault()
  }
  onWhitelistChange(e){
    const addresses = e.target.value.split(',')
    if(addresses!='undefined' && addresses.length!=0)
    {
      this.poolValues.whitelistAddresses = addresses.filter(w => typeof(w)!='undefined')
    }
  }
  onInputValueChange(event) {
    this.poolValues[event.target.id] = event.target.value;
  }
  onClose(e){
    this.presalePoolService.closePresale()
    this.showPoolStatus()
  }
  onTransfer(e) {
    this.presalePoolService.setTransferedState()
    this.showPoolStatus()
  }
  onSendContribution(e) {
    this.presalePoolService.sendContribution(this.poolValues.tokenAddress, this.poolValues.contribData)
    this.showPoolStatus()
  }

  render () {
    return (
      <div className="container container_bg">
        <div className="form-content">
          <div className="content-70">
            <h1 className="title"><strong>Pool Admin</strong></h1>
            <div className="form-inline-i form-inline-i_token-address">
              <label className="label">Pool Smart Contract Address</label>
              <label className="walletAddress">{this.presalePoolSettings.presalePoolAddress}</label>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label className="label">Your account address</label>
              <label className="walletAddress">{this.defaultAccount}</label>
            </div>
            <Form className="form" onSubmit={this.onSubmit}>
            <div className="">
            <div>
              <h5 className="header-2"><strong>Exchange Rate</strong></h5>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Price Per Token (ETH)</label>
                <Input type="number" className="input" id="tokenPrice" value={Web3Utils.fromWei(this.poolValues.tokenPrice.toString())} onChange ={this.onInputValueChange} validations={[required]}/>
              </div>
              <h5 className="header-2"><strong>Allocation</strong></h5>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Maximum Allocation (ETH)</label>
                <Input type="number" className="input" id="maxAllocation" value={Web3Utils.fromWei(this.poolValues.maxAllocation)} onChange ={this.onInputValueChange} validations={[required]}/>
              </div>
              <div className="form-inline-i form-inline-i_token-address">
              <div className="Ether-input">
                <div className="half-content">
                <label htmlFor="max-contrib" className="Maximum-Per-Contributor-ETH">Maximum Per Contributor (ETH)</label>
                <Input type="number" className="input" id="maxPerContributor" value={Web3Utils.fromWei(this.poolValues.maxPerContributor)} onChange ={this.onInputValueChange} validations={[required]}/>
                </div>
                <div className="half-content">
                <label htmlFor="min-contrib" className="Maximum-Per-Contributor-ETH">Minimum Per Contributor (ETH)</label>
                <Input type="number" className="input" id="minPerContributor" value={Web3Utils.fromWei(this.poolValues.minPerContributor)} onChange ={this.onInputValueChange} validations={[required]}/>
                </div>
              </div>
              </div>
              <h5 className="header-2"><strong>Admins</strong></h5>
              <div className="form-inline">
              </div>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Admin 1 Wallet Address</label>
                <Input className="input" id="adminWallet1" value={this.poolValues.adminWallet1} onChange ={this.onInputValueChange}/>
              </div>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Admin 2 Wallet Address</label>
                <Input className="input" id="adminWallet2" value={this.poolValues.adminWallet2} onChange ={this.onInputValueChange}/>
              </div>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Admin 3 Wallet Address</label>
                <Input className="input" id="adminWallet3" value={this.poolValues.adminWallet3} onChange ={this.onInputValueChange}/>
              </div>
              </div>

              <div>
              <h5 className="header-2"><strong>Whitelist</strong></h5>
              <div className="form-inline">
             <Textarea
                data-gram
                className="textarea"
                 value={this.poolValues.whitelistAddresses} onChange ={this.onWhitelistChange}></Textarea>
              </div>

              <h5 className="header-2"><strong>Fees</strong></h5>
              <div className="form-inline">
              </div>
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Pool Percentage</label>
                <Input type="number" className="input" id="feePercentage" value={this.poolValues.feePercentage} onChange ={this.onInputValueChange} validations={[required, isPercentage]}/>
              </div>
              <Button className="button">Submit</Button>
              </div>

              </div>
            </Form>
          </div>
            <div className="content-r"></div>
        <div className="content-30">
          <h5 className="header-2"><strong>Status</strong></h5>
          <Form>
          <div>
               <label className="walletAddress">{this.poolValues.status}</label>
               <div form-inline-i form-inline-i_token-address>
                <Button className="button_contrib" onClick={this.onClose}><p>Close</p></Button>
                <Button className="button_contrib" onClick={this.onTransfer}><p>Set Transfered</p></Button>
               </div>
          </div>
          </Form>
          <Form>
          <h5 className="header-2"><strong>Contribution</strong></h5>
          <label htmlFor="max-contrib" className="Maximum-Per-Contributor-ETH">Contribution (ETH)</label>
          <p className="send-info-amount">{this.poolValues.contribution}</p>
          <div form-inline-i form-inline-i_token-address>
          <label htmlFor="token-address" className="label">Destination Address</label>
          <Input  className="input" id="tokenAddress" value={this.poolValues.tokenAddress} onChange ={this.onInputValueChange}/>
          <label htmlFor="token-address" className="label">Data</label>
          <Input className="input" id="contribData" value={this.poolValues.contribData} onChange ={this.onInputValueChange}/>
           <Button className="button" onClick={this.onSendContribution}>Send Contribution</Button>
          </div>
          </Form>
          </div>
        </div>
      </div>
    );
  }
}
