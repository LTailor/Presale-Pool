import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import { inject, observer } from "mobx-react";
import Progress from 'react-progressbar';

@inject("ContributorService")
@observer
export class DashboardComponent extends React.Component {
  constructor(props){
    super(props);
    this.contributorService = props.ContributorService;
    this.contributorService.init('0x9a6db0CeB78DCef451a026EA3C475F1f6064B688')
    this.onContribute = this.onContribute.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);

    this.state = {
      maxContirbution : this.contributorService.maxContribution,
      minContribution: this.contributorService.minContribution,
      contributorAddress: this.contributorService.contributorAddress
    }
  }

  onContribute(e){
    this.contributorService.contribute()
    e.preventDefault();
  }

  onWithdraw(e)
  {
    this.contributorService.withdrawContribution()
    e.preventDefault();
  }

  render () {
    return (
      <div className="container container_bg">

        <div className="content">
        <Form>
        <div className="form-inline-i form-inline-i_token-address">
          <label htmlFor="token-address" className="label">My Wallet Address</label>
          <label htmlFor="network" className="walletAddress">{this.contributorService.contributorAddress}</label>
        </div>

        <div className="form-inline-i form-inline-i_token-address">
          <h5 className="header-2"><strong>My Contribution</strong></h5>
          <div className="form-inline">

                <p className="send-info-amount">{this.contributorService.contributionInEther} ETH</p>
          </div>
          <div className="form-inline">
              <p className="">Fees:</p>
              <p className="description">{this.contributorService.contributionInEther} %</p>

          </div>
          </div>
          <br/>
          <div className="form-inline-i form-inline-i_token-address">
            <div className="form-inline">
            <div className="form-inline-i form-inline-i_token-address">
                <Progress className="progressBar" completed = {22}/>
            </div>
            </div>
          </div>
          <div className="form-inline-i form-inline-i_token-address">
            <div className="form-inline">
            <div className="form-inline-i form-inline-i_token-address">
                <Button className="button" onClick={this.onContribute}><p>Contribute Ether</p></Button>
            </div>
            <div className="form-inline-i form-inline-i_token-address">
                <Button className="button" onClick={this.onWithdraw}><p>Withdraw Ether</p></Button>
            </div>
            </div>
          </div>

        </Form>
        </div>
      </div>
    );
  }
}
