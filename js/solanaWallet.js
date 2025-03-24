// Load Thirdweb SDK dynamically from CDN
import { ThirdwebSDK } from "https://cdn.jsdelivr.net/npm/@thirdweb-dev/sdk@4.0.0/dist/thirdweb-sdk.min.js";

// Define Solana Network
const network = "devnet"; // Change to "devnet" for testing

// Thirdweb SDK for Solana
const sdk = new ThirdwebSDK(network);

// Phantom Wallet Connection
let wallet;

// Your Wallet to Receive Payments
const RECEIVER_WALLET = "4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd"; 
const WILD_TOKEN_CONTRACT = "YOUR_WILD_TOKEN_CONTRACT_ADDRESS"; // Replace with actual token contract
const USDC_MINT = "EPjFWdd5AufqSS5F8to3qCqkw3eyZqfzZ93N61uxm4Me"; // USDC Mint Address on Solana

// Function to Connect Phantom Wallet
async function connectWallet() {
  try {
    if (!window.solana) {
      alert("Phantom Wallet not found! Install Phantom.");
      return;
    }

    wallet = window.solana;
    await wallet.connect();
    console.log("Wallet Connected:", wallet.publicKey.toBase58());
    document.getElementById("walletAddress").innerText = `Connected: ${wallet.publicKey.toBase58()}`;
  } catch (error) {
    console.error("Wallet Connection Error:", error);
  }
}

// Function to Buy WILD Tokens
async function buyToken() {
  const method = document.getElementById("paymentMethod").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!wallet || !wallet.publicKey) {
    alert("Please connect your wallet first!");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  let tokenAmount = (amount * 1099) / 100; // 1 SOL = 10.99 WILD

  try {
    let tx;

    if (method === "sol") {
      // Send SOL to receiver wallet
      tx = await sdk.wallet.transfer(RECEIVER_WALLET, amount);
    } else if (method === "usd") {
      // Send USDC equivalent to receiver wallet
      const usdcAmount = amount * 1_000_000; // 1 USDC = 1,000,000 units
      tx = await sdk.wallet.transfer(RECEIVER_WALLET, usdcAmount, USDC_MINT);
    } else {
      alert("Invalid payment method selected!");
      return;
    }

    console.log("Transaction Successful:", tx);
    alert(`Success! Sent ${amount} ${method.toUpperCase()} to ${RECEIVER_WALLET}`);

    // Optional: Send WILD tokens to user
    // await sdk.token(WILD_TOKEN_CONTRACT).transfer(wallet.publicKey.toBase58(), tokenAmount);
    // alert(`You received ${tokenAmount} WILD tokens!`);
  } catch (error) {
    console.error("Transaction Error:", error);
    alert("Transaction failed!");
  }
}

// Attach Event Listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("buybutton").addEventListener("click", buyToken);
