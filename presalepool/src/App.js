import React, { Component } from 'react';
import { Header, WalletComponent, CreateComponent, DashboardComponent, AdminComponent } from './components';
import { Route } from 'react-router-dom';
import './assets/stylesheets/application.css';

export class App extends React.Component {
  render(){
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
