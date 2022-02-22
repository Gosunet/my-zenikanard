import React, { useMemo } from 'react'
import Web3 from 'web3'

import { InjectedConnector } from '@web3-react/injected-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { Web3WalletButton } from './Web3WalletButton'

import styles from './Web3Connector.module.css'

const Web3Connector = () => {
  const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xA869',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/'],
  }
  
  const ETHEREUM_TESTNET_PARAMS = {
    chainId: '0x4',
    chainName: 'Ethereum Rinkerby',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkey.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://rinkey.etherscan.io'],
  }

  const injected = new InjectedConnector({
    supportedChainIds: [ parseInt(ETHEREUM_TESTNET_PARAMS.chainId, 16), parseInt(AVALANCHE_TESTNET_PARAMS.chainId, 16)],
  })

  const { active, activate, deactivate, error, library } = useWeb3React<Web3>()
  console.log(library)

  

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const isUnsupportedChainIdError = useMemo(() => {
    return error instanceof UnsupportedChainIdError
  }, [error])

  // Working with Rinkerby now
  // useEffect(() => {
  //   if (isUnsupportedChainIdError) {
  //     console.log('useEffect called')
  //     injected.getProvider().then((provider) => {
  //       provider
  //         .request({
  //           method: 'wallet_addEthereumChain',
  //           params: [AVALANCHE_TESTNET_PARAMS],
  //         })
  //         .catch((error: any) => {
  //           console.log(error)
  //         })
  //     })
  //   }
  // }, [AVALANCHE_TESTNET_PARAMS, connector, injected, isUnsupportedChainIdError])

  return (
    <div className={styles.connector}>
      {isUnsupportedChainIdError ? <p>Network change required</p> : null}
      <Web3WalletButton connect={connect} />
      {active ? <button onClick={disconnect}>Disconnect</button> : null}
    </div>
  )
}

export default Web3Connector
