import { Connection, PublicKey, Transaction, SystemProgram } from "https://cdn.jsdelivr.net/npm/@solana/web3.js/+esm";

const SOLANA_RPC = "https://api.devnet.solana.com"; 
// Use "https://api.devnet.solana.com" for testnet
const connection = new Connection(SOLANA_RPC);
let wallet = null; // Store connected wallet

// ✅ Connect to Solana Wallet (Phantom, Solflare, etc.)
async function connectWallet() {
  if (!window.solana || !window.solana.isPhantom) {
    alert("Solana wallet not found! Install Phantom or Solflare.");
    return;
  }

  try {
    const response = await window.solana.connect();
    wallet = response.publicKey;
    document.getElementById("walletAddress").innerText = `Connected: ${wallet.toBase58()}`;
    fetchBalance();
  } catch (error) {
    console.error("Wallet Connection Failed:", error);
    alert("Failed to connect wallet.");
  }
}

// ✅ Get Wallet Balance
async function fetchBalance() {
  if (!wallet) {
    alert("Connect your wallet first!");
    return;
  }

  try {
    const balance = await connection.getBalance(wallet);
    document.getElementById("walletBalance").innerText = `Balance: ${balance / 10 ** 9} SOL`;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
  }
}

// ✅ Send SOL Transaction
async function sendSol() {
  const recipientAddress = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;

  if (!wallet) {
    alert("Connect your wallet first!");
    return;
  }
  if (!recipientAddress || !amount) {
    alert("Enter recipient address and amount.");
    return;
  }

  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amount * 10 ** 9, // Convert SOL to lamports
      })
    );

    const { signature } = await window.solana.signAndSendTransaction(transaction);
    alert(`Transaction sent! Signature: ${signature}`);
    window.open(`https://solscan.io/tx/${signature}`, "_blank");
    fetchBalance();
  } catch (error) {
    console.error("Transaction Failed:", error);
    alert("Transaction failed.");
  }
}

// ✅ Add Event Listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("sendSol").addEventListener("click", sendSol);
