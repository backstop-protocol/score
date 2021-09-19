const cTokenAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "underlying_",
          "type": "address"
        },
        {
          "internalType": "contract ComptrollerInterface",
          "name": "comptroller_",
          "type": "address"
        },
        {
          "internalType": "contract InterestRateModel",
          "name": "interestRateModel_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "initialExchangeRateMantissa_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "decimals_",
          "type": "uint8"
        },
        {
          "internalType": "address payable",
          "name": "admin_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "implementation_",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "becomeImplementationData",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "cashPrior",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "interestAccumulated",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "borrowIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalBorrows",
          "type": "uint256"
        }
      ],
      "name": "AccrueInterest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "borrowAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "accountBorrows",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalBorrows",
          "type": "uint256"
        }
      ],
      "name": "Borrow",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "error",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "info",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "detail",
          "type": "uint256"
        }
      ],
      "name": "Failure",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "liquidator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "repayAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "cTokenCollateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "seizeTokens",
          "type": "uint256"
        }
      ],
      "name": "LiquidateBorrow",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "minter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "mintAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "mintTokens",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newAdmin",
          "type": "address"
        }
      ],
      "name": "NewAdmin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "contract ComptrollerInterface",
          "name": "oldComptroller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "contract ComptrollerInterface",
          "name": "newComptroller",
          "type": "address"
        }
      ],
      "name": "NewComptroller",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldImplementation",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "NewImplementation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "contract InterestRateModel",
          "name": "oldInterestRateModel",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "contract InterestRateModel",
          "name": "newInterestRateModel",
          "type": "address"
        }
      ],
      "name": "NewMarketInterestRateModel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldPendingAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newPendingAdmin",
          "type": "address"
        }
      ],
      "name": "NewPendingAdmin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldReserveFactorMantissa",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newReserveFactorMantissa",
          "type": "uint256"
        }
      ],
      "name": "NewReserveFactor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "redeemer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "redeemAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "redeemTokens",
          "type": "uint256"
        }
      ],
      "name": "Redeem",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "repayAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "accountBorrows",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalBorrows",
          "type": "uint256"
        }
      ],
      "name": "RepayBorrow",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "benefactor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "addAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newTotalReserves",
          "type": "uint256"
        }
      ],
      "name": "ReservesAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "reduceAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newTotalReserves",
          "type": "uint256"
        }
      ],
      "name": "ReservesReduced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "_acceptAdmin",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "addAmount",
          "type": "uint256"
        }
      ],
      "name": "_addReserves",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "reduceAmount",
          "type": "uint256"
        }
      ],
      "name": "_reduceReserves",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "contract ComptrollerInterface",
          "name": "newComptroller",
          "type": "address"
        }
      ],
      "name": "_setComptroller",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "implementation_",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "allowResign",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "becomeImplementationData",
          "type": "bytes"
        }
      ],
      "name": "_setImplementation",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "contract InterestRateModel",
          "name": "newInterestRateModel",
          "type": "address"
        }
      ],
      "name": "_setInterestRateModel",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address payable",
          "name": "newPendingAdmin",
          "type": "address"
        }
      ],
      "name": "_setPendingAdmin",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newReserveFactorMantissa",
          "type": "uint256"
        }
      ],
      "name": "_setReserveFactor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "accrualBlockNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "accrueInterest",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOfUnderlying",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "borrowAmount",
          "type": "uint256"
        }
      ],
      "name": "borrow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "borrowBalanceCurrent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "borrowBalanceStored",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "borrowIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "borrowRatePerBlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "comptroller",
      "outputs": [
        {
          "internalType": "contract ComptrollerInterface",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "delegateToImplementation",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "delegateToViewImplementation",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "exchangeRateCurrent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "exchangeRateStored",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getAccountSnapshot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getCash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "implementation",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "interestRateModel",
      "outputs": [
        {
          "internalType": "contract InterestRateModel",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isCToken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "repayAmount",
          "type": "uint256"
        },
        {
          "internalType": "contract CTokenInterface",
          "name": "cTokenCollateral",
          "type": "address"
        }
      ],
      "name": "liquidateBorrow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "mintAmount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "pendingAdmin",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "redeemTokens",
          "type": "uint256"
        }
      ],
      "name": "redeem",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "redeemAmount",
          "type": "uint256"
        }
      ],
      "name": "redeemUnderlying",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "repayAmount",
          "type": "uint256"
        }
      ],
      "name": "repayBorrow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "repayAmount",
          "type": "uint256"
        }
      ],
      "name": "repayBorrowBehalf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "reserveFactorMantissa",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "liquidator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "seizeTokens",
          "type": "uint256"
        }
      ],
      "name": "seize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "supplyRatePerBlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalBorrows",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "totalBorrowsCurrent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalReserves",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "dst",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "src",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "dst",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "underlying",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const registryAbi = [{"inputs":[{"internalType":"address","name":"_comptroller","type":"address"},{"internalType":"address","name":"_comp","type":"address"},{"internalType":"address","name":"_cEther","type":"address"},{"internalType":"address","name":"_pool","type":"address"},{"internalType":"address","name":"_bComptroller","type":"address"},{"internalType":"address","name":"_compVoter","type":"address"},{"internalType":"address","name":"_avatarImpl","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"bytes4","name":"functionSig","type":"bytes4"},{"indexed":false,"internalType":"bool","name":"whitelist","type":"bool"}],"name":"AvatarCallWhitelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":false,"internalType":"address","name":"avatar","type":"address"},{"indexed":false,"internalType":"address","name":"delegatee","type":"address"}],"name":"Delegate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"avatar","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewAvatar","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPool","type":"address"},{"indexed":false,"internalType":"address","name":"newPool","type":"address"}],"name":"NewPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldScore","type":"address"},{"indexed":false,"internalType":"address","name":"newScore","type":"address"}],"name":"NewScore","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":false,"internalType":"address","name":"avatar","type":"address"},{"indexed":false,"internalType":"address","name":"delegatee","type":"address"}],"name":"RevokeDelegate","type":"event"},{"constant":true,"inputs":[],"name":"avatarImpl","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"avatarLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"avatarList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"avatarOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"avatars","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bComptroller","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cEther","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comp","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"compVoter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"delegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"address payable","name":"target","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"delegateAndExecuteOnce","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegateAvatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_avatar","type":"address"}],"name":"doesAvatarExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"doesAvatarExistFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dummyCaller","outputs":[{"internalType":"contract DummyCaller","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"getAvatar","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"newAvatar","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pool","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"revokeDelegateAvatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"score","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newPool","type":"address"}],"name":"setPool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newScore","type":"address"}],"name":"setScore","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes4","name":"functionSig","type":"bytes4"},{"internalType":"bool","name":"list","type":"bool"}],"name":"setWhitelistAvatarCall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes4","name":"","type":"bytes4"}],"name":"whitelistedAvatarCalls","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
  
  const comptrollerAbi = [{
    "constant": true,
    "inputs": [],
    "name": "oracle",
    "outputs": [
        {
            "internalType": "contract PriceOracle",
            "name": "",
            "type": "address"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}]

const oracleAbi = [{"inputs":[{"internalType":"contract OpenOraclePriceData","name":"priceData_","type":"address"},{"internalType":"address","name":"reporter_","type":"address"},{"internalType":"uint256","name":"anchorToleranceMantissa_","type":"uint256"},{"internalType":"uint256","name":"anchorPeriod_","type":"uint256"},{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig[]","name":"configs","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"anchorPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTimestamp","type":"uint256"}],"name":"AnchorPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"reporter","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"anchor","type":"uint256"}],"name":"PriceGuarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"PriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"reporter","type":"address"}],"name":"ReporterInvalidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"oldTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"UniswapWindowUpdated","type":"event"},{"inputs":[],"name":"anchorPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ethBaseUnit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"expScale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getTokenConfig","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cToken","type":"address"}],"name":"getTokenConfigByCToken","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"getTokenConfigBySymbol","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"symbolHash","type":"bytes32"}],"name":"getTokenConfigBySymbolHash","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"underlying","type":"address"}],"name":"getTokenConfigByUnderlying","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cToken","type":"address"}],"name":"getUnderlyingPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"invalidateReporter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lowerBoundAnchorRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"newObservations","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"acc","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"oldObservations","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"acc","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"messages","type":"bytes[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"},{"internalType":"string[]","name":"symbols","type":"string[]"}],"name":"postPrices","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceData","outputs":[{"internalType":"contract OpenOraclePriceData","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"prices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reporter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reporterInvalidated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"source","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"upperBoundAnchorRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

module.exports = {
  cTokenAbi,
  registryAbi,
  oracleAbi,
  comptrollerAbi
}