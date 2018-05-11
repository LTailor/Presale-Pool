import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';

export class Wallet extends React.Component {
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
                  <input type="text" className="input" id="wallet-address"/>
              </div>
            </div>
            <Button className="button button_next">Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}
