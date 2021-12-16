import React, { useState, useRef, Suspense } from 'react'
import cn from 'classnames'
import svgExport from 'save-svg-as-png'
import { getAsset } from './assets'
import { ethers } from "ethers";
import {
  layers,
  Layer,
  getLayerAssets,
  getCategoryLayers,
  getDefaultLayer,
} from './duck'

import { ReactComponent as Random } from './icons/random.svg'
import { ReactComponent as Trash } from './icons/trash.svg'
import { ReactComponent as Download } from './icons/download.svg'
import { ReactComponent as ByZenika } from './icons/byzenika.svg'
import { ReactComponent as Netlify } from './icons/netlify.svg'

import AssetButton from './components/AssetButton'
import UpdateApp from './components/UpdateApp'
import Web3Connector from './components/Web3Connector'
import Mint from './components/Mint'

import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

import useAssets from './useAssets'
import styles from './App.module.css'

import myEpicNft from './abi/CryptoDuck.json';

declare const window: any;

function App() {
  const svgElement = useRef<SVGSVGElement>(null)
  const [selectedLayer, setSelectedLayer] = useState<Layer>(getDefaultLayer())
  const { selectedAssets, addAsset, randomize, reset } = useAssets()

  const isAssetsSelected = (assetName?: string) => {
    if (!selectedLayer) return false
    const selectedAsset = selectedAssets[selectedLayer.id]
    if (!assetName) return !selectedAsset
    return selectedAsset === assetName
  }

  const download = () => {
    svgExport.saveSvgAsPng(svgElement?.current, 'zenikanard.png')
  }

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x6864cDe0A40Ed1E172BF9EfC507881D0477cB93c";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }  

  return (
    <Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
      <div className={styles.app}>
        <div className={styles.background}></div>

        <div className={styles.header}>
          <Web3Connector />
          <button onClick={askContractToMintNft} className={styles.mintButton}>Mint NFT</button>
          <div className={styles.title}>
            Pimp My <span className={styles.titleInner}>Duck</span>
            <ByZenika className={styles.byZenika} />
          </div>
        </div>
        <main className={styles.main}>
          <div className={styles.canvas}>
            <svg
              ref={svgElement}
              width="2000"
              height="2000"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2000 2000"
            >
              {layers.map((layer: Layer) => {
                let Asset
                if (!layer.name) {
                  Asset = getAsset(layer.id)
                } else {
                  Asset = getAsset(selectedAssets[layer.id])
                }
                return (
                  Asset && (
                    <Suspense key={layer.id} fallback={null}>
                      <Asset />
                    </Suspense>
                  )
                )
              })}
            </svg>
          </div>
          <div className={cn(styles.categories, styles.categoriesLeft)}>
            <div className={styles.categoriesInner}>
              {getCategoryLayers().map((layer) => {
                if (!selectedLayer) return undefined
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    className={cn(styles.categoryButton, {
                      [styles.selected]: layer.id === selectedLayer.id,
                    })}
                  >
                    {layer.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div className={cn(styles.categories, styles.categoriesRight)}>
            <div className={styles.categoriesInner}>
              <AssetButton
                onClick={addAsset}
                layer={selectedLayer}
                selected={isAssetsSelected(undefined)}
              />
              {getLayerAssets(selectedLayer?.id).map((assetName, index) => (
                <AssetButton
                  key={index}
                  assetName={assetName}
                  onClick={addAsset}
                  layer={selectedLayer}
                  selected={isAssetsSelected(assetName)}
                />
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.circle}
              onClick={reset}
              title="Reset"
              aria-label="Reset"
            >
              <Trash height="24px" width="24px" />
            </button>
            <button
              className={styles.circle}
              onClick={randomize}
              title="Random"
              aria-label="Random"
            >
              <Random height="24px" width="24px" />
            </button>
            <button
              className={styles.circle}
              onClick={download}
              title="Download"
              aria-label="Download"
            >
              <Download height="24px" width="24px" />
            </button>
            <button
              className={styles.circle}
              onClick={download}
              title="Mint"
              aria-label="Mint"
            >
              <Mint
              //  height="24px" width="24px" 
               />
            </button>
          </div>
          <UpdateApp />
        </main>
        <a href="https://www.netlify.com/" className={styles.netlify}>
          <Netlify />
        </a>
      </div>
    </Web3ReactProvider>
  )
}

export default App
