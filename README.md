# PresalePool

This service provides easy creation of presale pools.

# Installation

After cloning this repository you need install MetaMask extension to Chrome or Firefox.
Start Ganache and in `contracts` directory run
```
truffle migrate --network development --reset
```
Copy and save PresalePoolProxy address. Paste this address in `./presalepool/src/services/presalePoolService.js`
```
presalePoolProxyAddress = ""; //presale pool proxy address
```
Then move to root of this repo and enter
```
cd presalepool
npm run start
```

# How to use?

Open `http://localhost:3000/?#/pool/wallet`

Enter you wallet address where you will init presale smart contract from (may be will be deleted).
Then push Submit

Page `#/pool/create` will be opened. Set ALL settings which you see. Push Submit. You will see Presale Proxy address near the submit button.
Copy it and save.

Now you can open admin page `http://localhost:3000/?#/pool/admin?pool_address=<the address of presale smart contract>`.
If you open this page with admin wallet, you will see the settings.

You can open `http://localhost:3000/?#/pool/dashboard?pool_address=<the address of presale smart contract>` to see contributor dashboard.
