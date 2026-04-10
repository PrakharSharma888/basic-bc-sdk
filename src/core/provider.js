const { ProviderError } = require("../utils/errors");
const { ethers } = require("ethers");

/**
 * Provider class for interacting with the blockchain.
 */
class Provider {
    constructor(rpcUrl) {
        this.rpcUrl = rpcUrl;
        this.ethersProvider = new ethers.JsonRpcProvider(rpcUrl);
    }

    async getBlockNumber() {
        try {
            return await this.ethersProvider.getBlockNumber();
        } catch (err) {
            throw new ProviderError(`Failed to fetch block number: ${err.message}`);
        }
    }

    async getBalance(address) {
        try {
            return await this.ethersProvider.getBalance(address);
        } catch (err) {
            throw new ProviderError(`Failed to fetch balance for ${address}: ${err.message}`);
        }
    }

    async getTransactionReceipt(hash) {
        try {
            return await this.ethersProvider.getTransactionReceipt(hash);
        } catch (err) {
            throw new ProviderError(`Failed to fetch receipt for ${hash}: ${err.message}`);
        }
    }

    async waitForTransaction(hash) {
        try {
            return await this.ethersProvider.waitForTransaction(hash);
        } catch (err) {
            throw new ProviderError(`Error while waiting for transaction ${hash}: ${err.message}`);
        }
    }
}

module.exports = Provider;
