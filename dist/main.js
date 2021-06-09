import { Blockchain } from './bc-transactions.js';
var Status;
(function (Status) {
    Status["Init"] = "\uD83D\uDD28 Creating blockchain...";
    Status["AddTransaction"] = "\u23F3 Adding your transaction...";
    Status["ReadyToMine"] = "\u2728 Ready to mine your transactions!";
    Status["MineInProgress"] = "\u26CF Mining...";
})(Status || (Status = {}));
const statusField = document.getElementById('status'), senderField = document.getElementById('sender'), recipientField = document.getElementById('recipient'), amountField = document.getElementById('amount'), transferButton = document.getElementById('transfer'), pendingTransactionsField = document.getElementById('pending-transactions'), confirmButton = document.getElementById('confirm'), blocksField = document.getElementById('blocks');
(async function main() {
    transferButton.addEventListener('click', addTransaction);
    confirmButton.addEventListener('click', mineBlock);
    statusField.textContent = Status.Init;
    const blockchain = new Blockchain();
    await blockchain.createGenesisBlock();
    blocksField.innerHTML = blockchain.chain.map((block, index) => generateBlockHtml(block, index)).join('');
    statusField.textContent = Status.AddTransaction;
    toggleDisabling(true, false);
    function addTransaction() {
        const transaction = {
            sender: senderField.value,
            recipient: recipientField.value,
            amount: parseInt(amountField.value)
        };
        blockchain.createTransaction(transaction);
        toggleDisabling(false, false);
        pendingTransactionsField.textContent = blockchain.pendingTransactions.map(t => `${t.sender} to ${t.recipient} - $${t.amount}`).join('\n');
        statusField.textContent = Status.ReadyToMine;
        senderField.value = '';
        recipientField.value = '';
        amountField.value = '0';
    }
    async function mineBlock() {
        statusField.textContent = Status.MineInProgress;
        toggleDisabling(true, true);
        await blockchain.minePendingTransactions();
        pendingTransactionsField.textContent = 'No pending transaction...';
        statusField.textContent = Status.AddTransaction;
        blocksField.innerHTML = blockchain.chain.map((block, index) => generateBlockHtml(block, index)).join('');
        toggleDisabling(true, false);
    }
})();
function toggleDisabling(confirmation, transfering) {
    confirmButton.disabled = confirmation;
    senderField.disabled = recipientField.disabled = amountField.disabled = transferButton.disabled = transfering;
}
function generateBlockHtml(block, index) {
    return `
  <div class="p-2 border border-gray-200 bg-white rounded">
            <span class="mr-2">#${index}</span>
            <span>${new Date().toLocaleDateString()}</span>
            <div class="my-2">
              <div class="font-bold text-blue-600">Parent Hash:</div>
              <div>${block.parentHash}</div>
            </div>
            <div class="my-2">
              <div class="font-bold text-blue-600">This Hash:</div>
              <div>${block.hash}</div>
            </div>
            <div>
              <div class="font-bold text-blue-600">Transactions:</div>
              <div>${block.transactions.map(t => `${t.sender} → ${t.recipient} - $${t.amount}`)}</div>
            </div>
          </div>
  `;
}
