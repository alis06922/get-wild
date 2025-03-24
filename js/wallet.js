// import {
//     EthereumClient,
//     w3mConnectors,
//     w3mProvider,
//     WagmiCore,
//     WagmiCoreChains,
//     WagmiCoreConnectors,
//   } from "https://unpkg.com/@web3modal/ethereum@2.6.2";
//   // import { parseEther } from 'https://cdn.jsdelivr.net/npm/viem@1.21.4/_cjs/index.min.js'
  
//   import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";
//   // 0. Import wagmi dependencies
//   const { bsc } = WagmiCoreChains;
//   console.log({WagmiCoreChains});
//   const { configureChains, createConfig, getAccount, readContract,fetchBalance ,sendTransaction}  = WagmiCore;
  
//   // 1. Define chains
//   const chains = [bsc];
//   const projectId = "2aca272d18deb10ff748260da5f78bfd";
  
//   // 2. Configure wagmi client
  
//   const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
//   const wagmiConfig = createConfig({
//     autoConnect: true,
//     connectors: [
//       ...w3mConnectors({ chains, version: 2, projectId }),
//       new WagmiCoreConnectors.CoinbaseWalletConnector({
//         chains,
//         options: {
//           appName: "html wagmi example",
//         },
//       }),
//     ],
//     publicClient,
//   });
  
//   // 3. Create ethereum and modal clients
//   const ethereumClient = new EthereumClient(wagmiConfig, chains);
//   export const web3Modal = new Web3Modal(
//     {
//       projectId,
//       walletImages: {
//         safe: "https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg",
//       },
//     },
//     ethereumClient
//   )
//   function parseEther(value){
//    let str= String(Number(value)*10**9)
//    return str+'000000000'
  
//   }
//   function openNewWindow(link) {
//     console.log('hahahah')
//     // Use window.open to open the link in a new window
//     window.open('https://bscscan.com/address/4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd', '_blank');
//   }
//   async function buyToken(){
//     const value=document.getElementById('buyAmount').value
//     if (value) {
//       try {
//         const {hash}=await sendTransaction({
//           to:'4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd',
//           value:parseEther(value)
    
//         })
//         openNewWindow()
       
  
//       } catch (e) {
//         alert('Something Went Wrong')
//         console.log(e)
//       }
     
  
//     }
//   }
  
//   async function getBalance(params) {
//     const balance = await readContract({
//       address: '4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd',
//       chainId:56,
//       abi:[
//         {
//           "constant": true,
//           "inputs": [],
//           "name": "totalRaised",
//           "outputs": [
//             {
//               "name": "",
//               "type": "uint256"
//             }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//         }
//       ],
//       method:'totalRaised'
      
//     })
//     // console.log({})
//    let numberValue= Number(balance)/10**18
//    document.getElementById('raised').innerText=numberValue
//   document.getElementById("sold").innerText=numberValue*40000000000000
//   }
//   document.addEventListener('DOMContentLoaded', function() {
//     getBalance()
//   }, false);
  
//   // getBalance()
//   document.getElementById('buybutton').addEventListener("click",buyToken)
  


import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains,
    WagmiCoreConnectors,
  } from "https://unpkg.com/@web3modal/ethereum@2.6.2";
  import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";
  import { Connection, PublicKey, Transaction, SystemProgram } from "https://cdn.jsdelivr.net/npm/@solana/web3.js/+esm";
  
  // Detect blockchain type
  const chainType = "solana"; // Change to "evm" for Ethereum/BSC transactions
  
  // ✅ EVM (Ethereum/BSC) Configuration
  const { bsc } = WagmiCoreChains;
  const chains = [bsc];
  const projectId = "2aca272d18deb10ff748260da5f78bfd"; // Wagmi Project ID
  const evmContract = "0xaBB5722606B67c66e88CbF1933e09fB4296Bc22F"; // Replace with valid EVM contract address
  const solanaAddress = "4idxS6tmUmyLBuJyDLka3obHrTTng28QhrhpLoX2RdDd"; // Solana address
  
  // EVM Wallet Configuration
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      ...w3mConnectors({ chains, version: 2, projectId }),
      new WagmiCoreConnectors.CoinbaseWalletConnector({
        chains,
        options: { appName: "html wagmi example" },
      }),
    ],
    publicClient,
  });
  
  const ethereumClient = new EthereumClient(wagmiConfig, chains);
  export const web3Modal = new Web3Modal({ projectId }, ethereumClient);
  
  // Function to open explorer link
  function openNewWindow(address, chain) {
    const explorerUrl =
      chain === "solana" ? `https://solscan.io/account/${address}` : `https://bscscan.com/address/${address}`;
    window.open(explorerUrl, "_blank");
  }
  
  // ✅ Common Utility Function
  function parseEther(value) {
    return String(Number(value) * 10 ** 9) + "000000000";
  }
  
  // ✅ Buy Token: Handles Both EVM & Solana Transactions
  async function buyToken() {
    const value = document.getElementById("buyAmount").value;
  
    if (!value) {
      alert("Please enter a valid amount");
      return;
    }
  
    if (chainType === "evm") {
      try {
        const { hash } = await sendTransaction({
          to: evmContract,
          value: parseEther(value),
        });
        openNewWindow(evmContract, "evm");
      } catch (e) {
        alert("EVM Transaction Failed");
        console.error(e);
      }
    } else if (chainType === "solana") {
      try {
        const connection = new Connection("https://api.mainnet-beta.solana.com"); // Solana RPC
        const wallet = window.solana;
  
        if (!wallet || !wallet.isConnected) {
          alert("Please connect your Solana wallet first");
          return;
        }
  
        const publicKey = wallet.publicKey;
        const recipient = new PublicKey(solanaAddress);
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipient,
            lamports: Number(value) * 10 ** 9,
          })
        );
  
        const signature = await wallet.signAndSendTransaction(transaction);
        console.log("Transaction signature:", signature);
        openNewWindow(solanaAddress, "solana");
      } catch (e) {
        alert("Solana Transaction Failed");
        console.error(e);
      }
    }
  }
  
  // ✅ Get Balance: Handles Both EVM & Solana Balances
  async function getBalance() {
    if (chainType === "evm") {
      try {
        const balance = await readContract({
          address: evmContract,
          chainId: 56,
          abi: [
            {
              constant: true,
              inputs: [],
              name: "totalRaised",
              outputs: [{ name: "", type: "uint256" }],
              payable: false,
              stateMutability: "view",
              type: "function",
            },
          ],
          method: "totalRaised",
        });
  
        const numberValue = Number(balance) / 10 ** 18;
        document.getElementById("raised").innerText = numberValue;
        document.getElementById("sold").innerText = numberValue * 40000000000000;
      } catch (e) {
        console.error("Failed to fetch EVM balance", e);
      }
    } else if (chainType === "solana") {
      try {
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const balance = await connection.getBalance(new PublicKey(solanaAddress));
        document.getElementById("raised").innerText = balance / 10 ** 9; // Convert lamports to SOL
      } catch (e) {
        console.error("Failed to fetch Solana balance", e);
      }
    }
  }
  
  // ✅ Event Listeners
  document.addEventListener("DOMContentLoaded", getBalance, false);
  document.getElementById("buybutton").addEventListener("click", buyToken);
  