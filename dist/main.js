import { Blockchain } from './bc-transactions.js';
var Status;
(function (Status) {
    Status["Init"] = "\u2728 Creating blockchain...";
    Status["AddTransaction"] = "\uD83D\uDCB0 Add one or more transactions!";
    Status["ReadyToMine"] = "\u2705 Ready to mine new block!";
    Status["MineInProgress"] = "\u26CF Mining...";
})(Status || (Status = {}));
const statusField = document.getElementById('status'), senderField = document.getElementById('sender'), recipientField = document.getElementById('recipient'), amountField = document.getElementById('amount'), transferButton = document.getElementById('transfer'), pendingTransactionsField = document.getElementById('pending-transactions'), confirmButton = document.getElementById('confirm'), blocksField = document.getElementById('blocks');
(async function main() {
    transferButton.addEventListener('click', addTransaction);
    confirmButton.addEventListener('click', mineBlock);
    statusField.textContent = Status.Init;
    toggleDisabling(true, true);
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
        pendingTransactionsField.innerHTML = blockchain.pendingTransactions.map(t => `<p>${t.sender} to ${t.recipient}: $${t.amount}`).join('</p>');
        statusField.textContent = Status.ReadyToMine;
        senderField.value = '';
        recipientField.value = '';
        amountField.value = '';
    }
    async function mineBlock() {
        statusField.textContent = Status.MineInProgress;
        toggleDisabling(true, true);
        await blockchain.minePendingTransactions();
        pendingTransactionsField.textContent = 'No pending transaction...';
        statusField.textContent = Status.AddTransaction;
        console.log(blockchain.chain);
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
  `;
}
