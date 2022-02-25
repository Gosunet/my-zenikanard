import React, { FC } from 'react'
import styles from '../App.module.css'
import { ReactComponent as MintIcon } from '../icons/nft.svg'
import myEpicNft from '../abi/CryptoDuck.json'
import svgExport from 'save-svg-as-png'
import { ethers } from 'ethers'
import axios from 'axios'

const uploadSvgToPIPFS = async ({
  svg,
  name,
}: {
  svg: string
  name: string
}) => {
  const res = await axios.post(
    'https://biirzzx75m.execute-api.eu-west-3.amazonaws.com/Prod/pinIpfs/',
    JSON.stringify({ name, rawSvg: svg }),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.AWS_APIKEY}`,
      },
    }
  )

  return res.data.cid
}

declare const window: any

type MintProps = { svgRef: React.RefObject<SVGSVGElement> }

export const Mint: FC<MintProps> = ({ svgRef }) => {
  const CONTRACT_ADDRESS = '0x71255e09278411849A43Ceda5F75E35840BF0f42'

  const askContractToMintNft = async () => {
    console.log('Minting NFT')

    try {
      if (!svgRef.current) {
        throw new Error('No SVG')
      }
      const svg = await svgExport.prepareSvg(svgRef.current, {
        excludeCss: true,
      })

      const cid = await uploadSvgToPIPFS({
        svg: svg.src,
        name: `nft ${new Date().toISOString()}`,
      })
      console.log({ cid })

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
        let nftTxn = await connectedContract.makeAnEpicNFT(`ipfs://${cid}`)

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

export default Mint
