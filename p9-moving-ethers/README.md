# Moving Ethers Between L1 and L2

This project shows how to move Ether from Ethereum (Layer 1) into the Arbitrum (Layer 2) chain and vice versa.

A user deposits Ether onto Arbitrum using Arbitrum's general L1-to-L2 message passing system, and simply passing the desired Ether as callvalue and no additional data.

To withdraw Ether from Arbitrum, a client creates an outgoing / L2 to L1 message using the ArbSys interface that later lets them release Ether from its escrow in the L1 Bridge.sol contract.

## Deployed Contracts and Txns

1.  [Deposit Through Inbox | L1 Tx | Rinkeby Explorer](https://rinkeby.etherscan.io/tx/0xac896c72723301e9f7fd578f7b526fb8423f8e98dbc11e61f2ba22794a3a752c)
2.  [Deposit Through Inbox | L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x02cb22408913d775454ac0c26813ac436fc3891fdfaf828943b2669c70d5791b)
3.  [Deposit Through DApp | Deposit Contract L1 | Rinkeby Etherscan](https://rinkeby.etherscan.io/address/0x1252d9eCe69436Bf9f6d330bc03cfBaF6402BC09)
4.  [Deposit Through DApp | L1 Tx | Rinkeby Explorer](https://rinkeby.etherscan.io/tx/0xd44a97d511f819baf5e5a0e6781315f875156125ff04e895decb8594e9ca8e06)
5.  [Deposit Through DApp | L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0xc737ce44b6b561ce74e6aa83e14f9b7dca3f079f5b9a16db81f3415204bd1e1b)
6.  [Deposit Through arb-ts | L1 Tx | Rinkeby Explorer](https://rinkeby.etherscan.io/tx/0xf2382077e33a8fdc3d5069080aaddfbb2d7bd10b8de00c87757d681fb0c100b4)
7.  [Deposit Through arb-ts | L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x653c6ab180cd9da1b00353ec916b87626789e82300150c3875b164514d83ee23)
8.  [Withdraw Through ArbSys| L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x5277361a0ce72d2542c79a20801d26091e00033dc42c96e934c222a1f31ef9ce)
9.  [Withdraw Through DApp | Withdraw Contract L2 | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/address/0x246d1ffa7F6f130BdceA3B4e25FE26Ea630fF3D8)
10. [Withdraw Through DApp | L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0xba53225eb9ed117a5b70bea31e22b43103a79e9abcfbcd10f8426f7a227f75ef)
11. [Withdraw Through arb-ts | L2 Tx | Rinkeby Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x7e2cdfa20459829d03475b5799dbb8b209e56f00c86b5bae9662d3223e93c9f8)
