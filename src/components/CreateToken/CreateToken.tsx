"use client";

import dynamic from "next/dynamic";
import type { CropModalProps } from "@/components/CropModal";

// Dynamically import the modal
const CropModal = dynamic<CropModalProps>(
  () => import("@/components/CropModal"),
  { ssr: false }
);

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { motion } from "framer-motion";
import {
  Connection,
  Transaction,
  SystemProgram,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";

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

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

declare global {
  interface Window {
    solana?: any;
  }
}

const CreateToken = () => {
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

  const LAMPORTS_TO_SEND = 0.01 * 1e9;
  const YOUR_WALLET_ADDRESS = "DUC3EDAisrZWu1dX9n2SWhRYYzLNfqXFtxuAftSu8Sy1";

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
    const connection = await provider.connect();
    setWalletConnected(true);
    setWalletAddress(connection.publicKey.toString());
  };

  const sendSol = async () => {
    const provider = window?.solana;
    if (!provider?.isPhantom) throw new Error("Phantom wallet not found.");
    const sender = provider.publicKey || (await provider.connect()).publicKey;
    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const balance = await connection.getBalance(sender);
    if (balance < LAMPORTS_TO_SEND) throw new Error("Insufficient SOL balance to complete the transaction.");
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: new PublicKey(YOUR_WALLET_ADDRESS),
        lamports: LAMPORTS_TO_SEND,
      })
    );
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;
    try {
      const signed = await provider.signAndSendTransaction(transaction);
      return signed.signature;
    } catch (txError: any) {
      throw new Error(txError?.message || "An error occurred during the transaction.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setUploading(true);
    const isFormValid = validateFields();
    if (!isFormValid) return setUploading(false);
    try {
      await ensureWalletConnected();
      const txSignature = await sendSol();
      setStatus(`Token creation request sent! Transaction Signature: ${txSignature}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Insufficient SOL")) setStatus("Error: Your wallet does not have enough SOL to complete this transaction.");
        else if (err.message.includes("Phantom wallet not found")) setStatus("Error: Phantom wallet not found. Please install or unlock your Phantom wallet.");
        else if (err.message.includes("transaction")) setStatus(`Transaction failed: ${err.message}`);
        else setStatus(`Error: ${err.message}`);
      } else {
        setStatus("Transaction failed. An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
    }
  };




  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
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
              {/* Image Upload */}
<div className="space-y-2">
  <Label htmlFor="image">Token Image</Label>
  
  <div className="flex items-start gap-4">
    <div className="relative group cursor-pointer w-24 h-24">
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

    <div className="text-sm text-muted-foreground mt-1">
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

                           {/* Submit Button */}
                           <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" disabled={uploading} className="w-full">
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
                  <span className="text-black font-medium">0.4 SOL</span>
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