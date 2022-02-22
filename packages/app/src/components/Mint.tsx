import React, { FC } from 'react'
import styles from '../App.module.css'
import { ReactComponent as MintIcon } from '../icons/nft.svg'
import myEpicNft from '../abi/CryptoDuck.json'
import svgExport from 'save-svg-as-png'
import { ethers } from 'ethers'

declare const window: any

type MintProps = { svgRef: React.RefObject<SVGSVGElement> }

export const Mint: FC<MintProps> = ({ svgRef }) => {
  const CONTRACT_ADDRESS = '0x71255e09278411849A43Ceda5F75E35840BF0f42'

  const askContractToMintNft = async () => {
    try {
      const svg: string = await svgExport.svgAsDataUri(svgRef?.current)
	  console.log(svg)

      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )

        console.log('Going to pop wallet now to pay gas...')
        let nftTxn = await connectedContract.makeAnEpicNFT("https://theduckgallery.zenika.com/ducks/JuliaLehoux.png")

        console.log('Mining...please wait.')
        await nftTxn.wait()

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        )
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      className={styles.circle}
      onClick={askContractToMintNft}
      title="Mint"
      aria-label="Mint"
    >
      <MintIcon height="31px" width="31px" />
    </button>
  )
}

export default Mint;
