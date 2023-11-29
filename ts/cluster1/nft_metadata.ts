import wallet from './wba-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { PublicKey } from '@solana/web3.js';

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      'https://arweave.net/EJYVSTZ-odsekSDC77HCW0zU6B3_lCYHgmWqs97K35A';
    const metadata = {
      name: 'Musaab Exotic Rug',
      symbol: 'MER',
      description: 'WBA RUG',
      image: image,
      attributes: [{ trait_type: 'RugType', value: 'Exotic' }],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: '?',
          },
        ],
      },
      creators: [{ address: keypair.publicKey, share: 100 }],
    };

    const myUri = await bundlrUploader.uploadJson(metadata);
    console.log('Your image URI: ', myUri);
  } catch (error) {
    console.log('Oops.. Something went wrong', error);
  }
})();
