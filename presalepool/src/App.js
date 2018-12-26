import React from 'react';
import { Route } from 'react-router-dom';
import { inject } from "mobx-react";
import { Header, WalletComponent, CreateComponent, DashboardComponent, AdminComponent } from './components';
import './assets/stylesheets/application.css';

@inject("Stores")
export class App extends React.Component {

  componentDidMount() {
    let results
    let web3 = window.web3

    if (typeof web3 !== 'undefined') {
      web3 = new window.Web3(web3.currentProvider)
      web3.version.getNetwork((err, netId) => {
        var defaultAccount = web3.eth.defaultAccount || null;
        results = {
          web3Instance: web3,
          netId,
          injectedWeb3: true,
          defaultAccount
        }
        this.props.Stores.setWeb3Settings(results);
      })
    }
  }

  render(){
    if(!window.web3) {
      return <div> You must use Metamask </div>
    }

    return (
      <div>
        <Header/>
        <Route exact path="/pool/wallet" component={WalletComponent}/>
        <Route exact path="/pool/create" component={CreateComponent}/>
        <Route exact path="/pool/dashboard" component={DashboardComponent}/>
        <Route exact path="/pool/admin" component={AdminComponent}/>
      </div>
    );
  }
}
