import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';

export class CreateComponent extends React.Component {
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
              <input type="text" className="input" id="token-address"/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="max-contrib" className="label">Maximum Per Contributor (ETH)</label>
              <input type="text" className="input" id="max-contrib"/>
              <label htmlFor="min-contrib" className="label">Minimum Per Contributor (ETH)</label>
              <input type="text" className="input" id="min-contrib"/>
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
              <input type="text" className="input" id="admin-1-address"/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 2 Wallet Address</label>
              <input type="text" className="input" id="admin-2-address"/>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="label">Admin 3 Wallet Address</label>
              <input type="text" className="input" id="admin-3-address"/>
            </div>
            <Button className="button button_next">Submit</Button>
          </Form>

        </div>
      </div>
    );
  }
}
