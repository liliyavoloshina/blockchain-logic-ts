import * as crypto from 'crypto'

class Block {
  readonly nonce: number
  readonly hash: string
  constructor(
    readonly index: number,
    readonly parentHash: string,
    readonly timestamp: number,
    readonly data: string) {
    const { nonce, hash } = this.mine()
    this.nonce = nonce
    this.hash = hash
  }

  private mine(): { nonce: number, hash: string } {
    let nonce = 0
    let hash: string
    do {
      hash = this.generateHash(++nonce)
    } while (
      hash.startsWith('000') === false
    )
    return { nonce, hash }
  }

  private generateHash(nonce: number): string {
    const generatedHash = this.index + this.parentHash + this.timestamp + this.data + nonce
    return crypto.createHash('sha256').update(generatedHash).digest('hex')
  }
}

class Blockchain {
  readonly chain: Block[] = []

  constructor() {
    this.chain.push(new Block(0, '0', Date.now(), 'Genesis block'))
  }

  get latestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(data: string) {
    const newBlock = new Block(
      this.latestBlock.index + 1,
      this.latestBlock.hash,
      Date.now(),
      data
    )

    this.chain.push(newBlock)
  }
}
console.log('Initialize blockchain...')
const blockchain = new Blockchain()
console.log('Added first block...')
blockchain.addBlock('First block')
console.log('Added second block...')
blockchain.addBlock('Second block')
console.log(JSON.stringify(blockchain, null, 2))