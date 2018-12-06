import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import swal from 'sweetalert';
import { inject, observer } from "mobx-react";
import generateElementWithMessage from "../helpers/UIHelper";

@inject("Stores")
@observer
export class WalletComponent extends React.Component {
  constructor(props){
    super(props);
    this.walletStore = props.Stores.walletStore;
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.state = {
      walletAddress : ''
    }
  }

  componentWillReact() {
    this.setState({walletAddress: this.props.Stores.web3Settings.defaultAccount});
  }
  
  onSubmit(e){
    e.preventDefault()
    if (!this.walletStore.checkAddress(this.state.walletAddress))
    {
      swal({
        content: generateElementWithMessage(`${this.state.walletAddress} is not correct wallet address`),
        icon: "error",
      })
    }
    else {
      this.walletStore.setAddress(this.state.walletAddress)
      this.props.history.push('/pool/create')
    }
  }
  async onAddressChange(event) {
    this.setState({walletAddress: event.target.value});
  }
  render () {
    return (
      <div className="container container_bg">

        <div className="content">
          <h1 className="title"><strong>Enter Your Wallet Address</strong></h1>
          <p className="description">
          First we need to collect your ethereum wallet address so that you can
          interact with our smart-contract engine
          </p>
          <Form className="form" onSubmit={this.onSubmit}>
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_token-address">
                  <label htmlFor="token-address" className="label">Your wallet address</label>
                  <input type="text" className="input" id="wallet-address" defaultValue={this.props.Stores.web3Settings.defaultAccount} value={this.state.walletAddress} onChange={this.onAddressChange}/>
              </div>
            </div>
            <Button className="button button_next">Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}
