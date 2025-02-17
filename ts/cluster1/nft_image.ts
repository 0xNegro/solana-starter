import wallet from './wba-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { readFile } from 'fs/promises';

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    let content = await readFile('cluster1/images/generug.png');
    const image = createGenericFile(content, 'cluster1/images/generug.png');
    const [myUri] = await bundlrUploader.upload([image]);

    console.log('Your image URI: ', myUri);
  } catch (error) {
    console.log('Oops.. Something went wrong', error);
  }
})();
