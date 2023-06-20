import React, { FC, useEffect } from 'react'
import styles from '../App.module.css'
import { ReactComponent as MintIcon } from '../icons/nft.svg'
import myEpicNft from '../abi/CryptoDuck.json'
import svgExport from 'save-svg-as-png'
import { ethers } from 'ethers'
import axios from 'axios'

const uploadSvgToIPFS = async ({
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

type MintProps = {
  svgRef: React.RefObject<SVGSVGElement>
  setIsLoading: (loading: boolean) => void
}

export const Mint: FC<MintProps> = ({ svgRef, setIsLoading }) => {
  const CONTRACT_ADDRESS = '0x1d7E99B882b04136A43b867E313861f7c5112d8E'

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on('NewNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. You can see it in metasmask just import it ! Contract is ${CONTRACT_ADDRESS} and tokenId is ${tokenId}`
          )
        })

        console.log('Setup event listener!')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    console.log('Minting NFT')

    try {
      setIsLoading(true)
      if (!svgRef.current) {
        throw new Error('No SVG')
      }
      const svg = await svgExport.prepareSvg(svgRef.current, {
        excludeCss: true,
      })

      const cid = await uploadSvgToIPFS({
        svg: svg.src,
        name: `nft ${new Date().toISOString()}`,
      })
      console.log({ cid })

      const { ethereum } = window

      if (!ethereum) {
        throw new Error('No ethereum provider')
      }

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
        `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
      )
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    setupEventListener()
  }, [])

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
