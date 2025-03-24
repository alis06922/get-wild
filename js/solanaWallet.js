import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { getProvider, PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const RECEIVER_WALLET = "4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd"; // Your receiving wallet
const WILD_TOKEN_CONTRACT = "WILD_TOKEN_CONTRACT_ADDRESS"; // Replace with your actual token address
const USDC_MINT = "EPjFWdd5AufqSS5F8to3qCqkw3eyZqfzZ93N61uxm4Me"; // Solana USDC Mint Address

const sdk = new ThirdwebSDK("mainnet"); // Initialize Thirdweb SDK on Solana mainnet
let wallet;

// Function to connect Phantom Wallet
async function connectWallet() {
  try {
    const provider = getProvider();
    if (!provider) {
      alert("Phantom Wallet not found! Install Phantom.");
      return;
    }

    wallet = new PhantomWalletAdapter();
    await wallet.connect();
    console.log("Wallet Connected:", wallet.publicKey.toBase58());
    document.getElementById("walletAddress").innerText = `Connected: ${wallet.publicKey.toBase58()}`;
  } catch (error) {
    console.error("Wallet Connection Error:", error);
  }
}

// Function to buy WILD tokens
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

  let amountInLamports = amount * 1_000_000_000; // Convert SOL to lamports (1 SOL = 1 billion lamports)
  let tokenAmount = (amount * 1099) / 100; // 1 SOL = 10.99 WILD

  try {
    let tx;

    if (method === "sol") {
      // Send SOL to receiver wallet
      tx = await sdk.wallet.transfer(RECEIVER_WALLET, amountInLamports);
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

// Attach event listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("buybutton").addEventListener("click", buyToken);
