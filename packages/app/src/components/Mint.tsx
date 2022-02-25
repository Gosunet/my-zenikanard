import React, { FC } from 'react'
import styles from '../App.module.css'
import { ReactComponent as MintIcon } from '../icons/nft.svg'
import myEpicNft from '../abi/CryptoDuck.json'
import svgExport from 'save-svg-as-png'
import { ethers } from 'ethers'
import axios from 'axios'

const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud/',
  headers: {
    'Content-Type': 'application/json',
   
  },
})

const uploadSvgToPIPFS = async ({ svg, name }: { svg: Blob; name: string }) => {
  const formData = new FormData()
  formData.append('file', svg)
  console.log("data", formData.get("file"))

  formData.append(
    'pinataMetadata',
    JSON.stringify({
      name,
    })
  )
  const { data } = await pinataClient.post('pinning/pinFileToIPFS', formData, {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  })
  return data.IpfsHash
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
      console.log(svg.src)

      const svgBlob: Blob = new Blob([svg.src], {
        type: 'image/svg+xml',
      })
      console.log(await svgBlob.text())
      // call ipfs
      const cid = await uploadSvgToPIPFS({ svg: svgBlob, name: `nft ${new Date().toISOString()}` })
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
