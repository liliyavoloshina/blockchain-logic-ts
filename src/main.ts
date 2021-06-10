import { Block, Blockchain } from './bc-transactions.js'

enum Status {
  Init = `✨ Creating blockchain...`,
  AddTransaction = `💰 Add one or more transactions!`,
  ReadyToMine = `✅ Ready to mine new block!`,
  MineInProgress = `⛏ Mining...`
}

const statusField = document.getElementById('status') as HTMLDivElement,
  senderField = document.getElementById('sender') as HTMLInputElement,
  recipientField = document.getElementById('recipient') as HTMLInputElement,
  amountField = document.getElementById('amount') as HTMLInputElement,
  transferButton = document.getElementById('transfer') as HTMLButtonElement,
  pendingTransactionsField = document.getElementById('pending-transactions') as HTMLDivElement,
  confirmButton = document.getElementById('confirm') as HTMLButtonElement,
  blocksField = document.getElementById('blocks') as HTMLDivElement

(async function main(): Promise<void> {
  transferButton.addEventListener('click', addTransaction)
  confirmButton.addEventListener('click', mineBlock)

  statusField.textContent = Status.Init
  toggleDisabling(true, true)

  const blockchain = new Blockchain()
  await blockchain.createGenesisBlock()
  blocksField.innerHTML = blockchain.chain.map((block, index) => generateBlockHtml(block, index)).join('')

  statusField.textContent = Status.AddTransaction

  toggleDisabling(true, false)

  function addTransaction() {
    const transaction = {
      sender: senderField.value,
      recipient: recipientField.value,
      amount: parseInt(amountField.value)
    }
    blockchain.createTransaction(transaction)

    toggleDisabling(false, false)
    pendingTransactionsField.innerHTML = blockchain.pendingTransactions.map(t =>
      `<p>${t.sender} to ${t.recipient}: $${t.amount}`).join('</p>')

    statusField.textContent = Status.ReadyToMine

    senderField.value = ''
    recipientField.value = ''
    amountField.value = ''
  }

  async function mineBlock() {
    statusField.textContent = Status.MineInProgress
    toggleDisabling(true, true)
    await blockchain.minePendingTransactions()
    pendingTransactionsField.textContent = 'No pending transaction...'
    statusField.textContent = Status.AddTransaction
    blocksField.innerHTML = blockchain.chain.map((block, index) => generateBlockHtml(block, index)).join('')
    toggleDisabling(true, false)
  }
})()

function toggleDisabling(confirmation: boolean, transfering: boolean) {
  confirmButton.disabled = confirmation
  senderField.disabled = recipientField.disabled = amountField.disabled = transferButton.disabled = transfering
}

function generateBlockHtml(block: Block, index: number): string {
  return `
  <div class="p-2 border border-gray-200 bg-white rounded">
            <span class="mr-2">#${index + 1}</span>
            <span>${new Date().toLocaleDateString()}</span>
            <div class="my-2">
              <div class="font-bold text-blue-600">Parent Hash:</div>
              <div class="truncate">${block.parentHash}</div>
            </div>
            <div class="my-2">
              <div class="font-bold text-blue-600">This Hash:</div>
              <div class="truncate">${block.hash}</div>
            </div>
            <div>
              <div class="font-bold text-blue-600">Transactions:</div>
              <ul>${block.transactions.length > 0 ? block.transactions.map(t => `<li>${t.sender} → ${t.recipient}: $${t.amount}</li>`).join('') : '---'}</ul>
            </div>
          </div>
  `
}