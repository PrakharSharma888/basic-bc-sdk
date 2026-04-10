const { ethers } = require("ethers");
const { TransactionError, WalletError } = require("../utils/errors");

/**
 * Signer class for signing transactions.
 */
class Signer {
    constructor(privateKey, provider) {
        try {
            this.provider = provider;
            this.ethersWallet = new ethers.Wallet(privateKey, provider.ethersProvider);
            this.address = this.ethersWallet.address;
        } catch (err) {
            throw new WalletError(`Failed to initialize Wallet: ${err.message}`);
        }
    }

    async sendTransaction(tx) {
        try {
            const response = await this.ethersWallet.sendTransaction(tx);
            return response.hash;
        } catch (err) {
            throw new TransactionError(`Transaction failed: ${err.message}`);
        }
    }

    async sendToken(tokenAddress, to, amount) {
        if (!to || !amount || !tokenAddress) {
            throw new TransactionError("tokenAddress, to, and amount are required for token transfers");
        }
        // ERC20 transfer(address,uint256) method ID: 0xa9059cbb
        const data = `0xa9059cbb${to.replace('0x', '').padStart(64, '0')}${BigInt(amount).toString(16).padStart(64, '0')}`;
        
        return await this.sendTransaction({
            to: tokenAddress,
            data: data,
            gasLimit: 60000
        });
    }

    async deploy(abi, bytecode, args = []) {
        try {
            const factory = new ethers.ContractFactory(abi, bytecode, this.ethersWallet);
            const contract = await factory.deploy(...args);
            return contract.deploymentTransaction().hash;
        } catch (err) {
            throw new TransactionError(`Deployment failed: ${err.message}`);
        }
    }

    async sendNative(to, amount) {
        if (!to || !amount) {
            throw new TransactionError("Destination address and amount are required");
        }
        return await this.sendTransaction({
            to: to,
            value: amount,
            gasLimit: 21000
        });
    }

    async getAddress() {
        return this.address;
    }
}

module.exports = Signer;
