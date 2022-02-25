import pinataSdk from '@pinata/sdk';
import { Readable } from 'stream';
import { PINATA_API_KEY, PINATA_API_SECRET } from 'env';

// FIXME: use esbuild define API
const pinata = pinataSdk(PINATA_API_KEY, PINATA_API_SECRET);

export const pinIpfs = async (svgData: string, name: string) => {
    
    const readable = Readable.from(svgData);
    // @ts-ignore
    // HACK !! do not delete https://github.com/PinataCloud/Pinata-SDK/issues/28
    readable.path = `${name}.png`;

    const { IpfsHash: cid } = await pinata.pinFileToIPFS(readable, {
        pinataMetadata: {
            name,
        },
    });

    return cid;
};
