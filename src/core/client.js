const Provider = require("./provider");
const Signer = require("./signer");

/**
 * Main SDK Client Class
 */
class Client {
    constructor(rpcUrl, privateKey = null) {
        this.provider = new Provider(rpcUrl);
        if (privateKey) {
            this.signer = new Signer(privateKey, this.provider);
        }
    }
}

module.exports = Client;
