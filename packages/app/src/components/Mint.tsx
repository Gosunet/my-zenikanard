import React, { FC, useEffect } from 'react'
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

type MintProps = {
  svgRef: React.RefObject<SVGSVGElement>
  setIsLoading: (loading: boolean) => void
}

export const Mint: FC<MintProps> = ({ svgRef, setIsLoading }) => {
  const CONTRACT_ADDRESS = '0x088b5560Fb7ba276892711356D1E9a659466029d'

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        setIsLoading(true)
        let nftTxn = await connectedContract.makeAnEpicNFT(`ipfs://${cid}`)

        console.log('Mining...please wait.')
        await nftTxn.wait()

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        )
        console.log(
          `https://testnets.opensea.io/collection/cryptoduck-kdjlvzgc9c`
        )
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    setupEventListener();
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
