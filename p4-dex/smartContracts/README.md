# TypeChain x Truffle v5 Example

## Running

```sh
# it will automatically run TypeChain types generation
yarn

# Run `yarn generate-types` to manually regenerate them

# run tests
truffle test

# migrations are kinda tricky (look at known limitation section) - we need to transpile ts to js file (this is not a case for tests)
yarn migrate
```

## Known limitations

Migrations need to be transpiled to js before execution. Use `yarn migrate` instead of `truffle migrate` to transpile and migrate with a single command.

## Command for Verifying Smart Contract Source Code

After deployment, run the following command with one or more contracts that you wish to verify:

```sh
truffle run verify SomeContractName AnotherContractName --network networkName
```

You can optionally provide an explicit address of the contract(s) that you wish to verify. This may be useful when you have deployed multiple instances of the same contract. The address is appended with @<address> as follows:

```sh
truffle run verify ContractName@0x61C9157A9EfCaf6022243fA65Ef4666ECc9FD3D7 --network rinkeby
```

More details can be found [here](https://github.com/rkalis/truffle-plugin-verify).
