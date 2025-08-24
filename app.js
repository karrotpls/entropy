import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";
const ABI = [/* Paste your ABI here */];

export default function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return setStatus("Ethereum provider not found.");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(nftContract);
  };

  const mint = async () => {
    if (!contract) return setStatus("Contract not connected.");
    try {
      setStatus("Minting...");
      const tx = await contract.mintNFT({ value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      setStatus(`Mint successful! Tx: https://etherscan.io/tx/${tx.hash}`);
    } catch (err) {
      setStatus("Error: " + (err.reason || err.message));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Karrot x 404 NFT</h1>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <Button onClick={mint}>Mint NFT</Button>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
