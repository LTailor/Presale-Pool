import React, { Component } from 'react';
import { Header, Wallet, CreateComponent } from './components';
import { Route } from 'react-router-dom';
import './assets/stylesheets/application.css';

export class App extends React.Component {
  render(){
    return (
      <div>
        <Header/>
        <Route exact path="/pool/wallet" component={Wallet}/>
        <Route exact path="/pool/create" component={CreateComponent}/>
        <Route exact path="/pool/dashboard" component={DashboardComponent}/>
      </div>
    );
  }
}
