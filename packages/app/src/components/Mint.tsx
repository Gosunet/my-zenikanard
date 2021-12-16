import React from 'react'
import {useWeb3React} from '@web3-react/core'
import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import styles from '../App.module.css'
import { ReactComponent as MintIcon } from '../icons/netlify.svg'
import myEpicNft from '../abi/CryptoDuck.json';

const CONTRACT_ADDRESS = "0x6864cDe0A40Ed1E172BF9EfC507881D0477cB93c";



export default function Mint() {
	const {library} = useWeb3React<Web3>()

	const mint = async () => {
		if(!library) return-
		console.log(library)
				// library.
        
        const contract = new library.eth.Contract(myEpicNft.abi as AbiItem[], CONTRACT_ADDRESS);
        // const tx = await contract.methods.makeAnEpicNFT().send();
        // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/`, tx);
	}

	return (
		<button
			className={styles.circle}
			onClick={mint}
			title="Mint"
			aria-label="Mint"
		>
			<MintIcon
			//  height="24px" width="24px" 
				/>
		</button>
	)
}