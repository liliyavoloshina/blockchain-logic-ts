export interface Transaction {
  sender: string
  recipient: string
  amount: number
}

export class Block {
  private nonce: number
  hash: string

  constructor(private readonly parentHash: string, private readonly timestamp: number, private readonly transactions: Transaction[]) { }

  async generateHash(nonce: number): Promise<string> {
    const data = this.parentHash + this.timestamp + this.transactions + nonce
    const encodedData = new TextEncoder().encode(data)                            // encode as (utf-8) Uint8Array
    const hashedBuffer = await crypto.subtle.digest('SHA-256', encodedData)       // hash the data
    const hashArray = Array.from(new Uint8Array(hashedBuffer))                    // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')  // convert bytes to hex string
    return hashHex
  }

  async mine(): Promise<void> {
    do {
      this.hash = await this.generateHash(++this.nonce)
    } while (this.hash.startsWith('0000') === false)
  }
}

export class Blockchain {
  private _chain: Block[] = []
  private _pendingTransactions: Transaction[] = []

  private get latestBlock() {
    return this._chain[this._chain.length - 1]
  }
  private get chain() {
    return [...this._chain]
  }
  private get pendingTransactions() {
    return [...this._pendingTransactions]
  }

  async createGenesisBlock() {
    const block = new Block('0', Date.now(), [])
    await block.mine()
    this.chain.push(block)
  }

  createTransaction(transactions: Transaction) {
    this.pendingTransactions.push(transactions)
  }

  async minePendingTransactions() {
    const block = new Block(this.latestBlock.hash, Date.now(), this.pendingTransactions)
    await block.mine()
    this.chain.push(block)
    this._pendingTransactions = []
  }
}