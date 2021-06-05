"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("crypto"));
var Block = /** @class */ (function () {
    function Block(index, parentHash, timestamp, data) {
        this.index = index;
        this.parentHash = parentHash;
        this.timestamp = timestamp;
        this.data = data;
        var _a = this.mine(), nonce = _a.nonce, hash = _a.hash;
        this.nonce = nonce;
        this.hash = hash;
    }
    Block.prototype.mine = function () {
        var nonce = 0;
        var hash;
        do {
            hash = this.generateHash(++nonce);
        } while (hash.startsWith('000') === false);
        return { nonce: nonce, hash: hash };
    };
    Block.prototype.generateHash = function (nonce) {
        var generatedHash = this.index + this.parentHash + this.timestamp + this.data + nonce;
        return crypto.createHash('sha256').update(generatedHash).digest('hex');
    };
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [];
        this.chain.push(new Block(0, '0', Date.now(), 'Genesis block'));
    }
    Object.defineProperty(Blockchain.prototype, "latestBlock", {
        get: function () {
            return this.chain[this.chain.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Blockchain.prototype.addBlock = function (data) {
        var newBlock = new Block(this.latestBlock.index + 1, this.latestBlock.hash, Date.now(), data);
        this.chain.push(newBlock);
    };
    return Blockchain;
}());
console.log('Initialize blockchain...');
var blockchain = new Blockchain();
console.log('Added first block...');
blockchain.addBlock('First block');
console.log('Added second block...');
blockchain.addBlock('Second block');
console.log(JSON.stringify(blockchain, null, 2));
