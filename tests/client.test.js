const { Client } = require('../src');
const { DEFAULT_RPC_URL } = require('../src/utils/constants');
const assert = require('assert');
const { abi, bytecode } = require('./abi.js');

async function testClient() {
    console.log("Testing Client Orchestration...");
    const pk = "0x3e31041395dc9d66f915dcb13e2cc8f9a5fc9a9f4f0980d1f2b915dee87e5684";
    const client = new Client(DEFAULT_RPC_URL, pk);
    console.log(client);
    console.log(`Client Address: ${client.signer.address}`);
    assert(client.provider !== undefined, "Provider should be initialized");
    assert(client.signer !== undefined, "Signer should be initialized");

    try {
        const blockNumber = await client.provider.getBlockNumber();
        console.log(`Current Block Number: ${blockNumber}`);
        assert(blockNumber !== undefined, "Block number should be fetched");
    } catch (err) {
        console.log(`Provider check failed: ${err.message}`);
    }

    try {
        const balance = await client.provider.getBalance(client.signer.address);
        console.log(`Balance: ${balance}`);
    } catch (err) {
        console.log(`Fetch failed (expected if RPC is offline): ${err.message}`);
    }

    // try {
    //     const txhash = await client.signer.deploy(abi, bytecode, [client.signer.address]);
    //     console.log(`Transaction Hash: ${txhash}`);

    //     console.log("Waiting for deployment...");
    //     const receipt = await client.provider.waitForTransaction(txhash);
    //     console.log(`Contract Deployed at: ${receipt.contractAddress}`);

    //     assert(receipt.contractAddress !== undefined, "Contract address should be in receipt");
    // } catch (err) {
    //     console.log(`Deployment failed (expected if RPC is offline): ${err.message}`);
    // }

    console.log("Client test completed.\n");

    try{
        const txHash = await client.signer.sendNative("0x0Ed97d61F29E87b553e1EC52A2cBfA782Fa67464", "1000000000000000000");
        console.log(`Transaction Hash: ${txHash}`);
    }catch(err){
        console.log(`Send Native failed (expected if RPC is offline): ${err.message}`);
    }
}

if (require.main === module) {
    testClient();
}

module.exports = testClient;
