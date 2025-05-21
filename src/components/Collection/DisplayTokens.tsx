'use client'
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '../../../config/firebase';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getTokenMetadata } from '@solana/spl-token';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Coins, AlertCircle } from 'lucide-react';
import WalletNotConnected from '@/components/wallet-not-connected';
import EmptyCollection from '@/components/Collection/EmptyCollection';
// import { TokenMetadata } from '@solana/spl-token-metadata';
interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
  description: string;
  mintAddress: string;
}

const DisplayTokens = () => {
    const wallet = useWallet();
    const router = useRouter();
    const [tokens, setTokens] = useState<string[]>([]);
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
    const handleMint = (mintAddress: string) => {
      router.push(`/tokens/${mintAddress}`);
    };
  
    const fetchMetadataFromUri = async (uri: string) => {
      try {
        const response = await fetch(uri);
        const metadata = await response.json();
        return metadata;
      } catch (error) {
        console.error('Error fetching metadata from URI:', error);
        return null;
      }
    };
  
    const fetchMetadata = async (mintAddress: string) => {
      try {
        const mintPubkey = new PublicKey(mintAddress);
        const metadata = await getTokenMetadata(
          connection,
          mintPubkey,
          'confirmed',
          TOKEN_2022_PROGRAM_ID,
        );
        console.log(metadata);
        
        if (metadata && metadata.uri) {
          const fullMetadata = await fetchMetadataFromUri(metadata.uri);
          
          if (fullMetadata) {
            return {
              name: metadata.name || 'Unknown',
              symbol: metadata.symbol || 'Unknown',
              image: fullMetadata.image || '/placeholder.svg?height=200&width=200',
              description: fullMetadata.description || '',
              mintAddress
            };
          }
        }
        
        return {
          name: metadata?.name || 'Unknown',
          symbol: metadata?.symbol || 'Unknown',
          image: '/placeholder.svg?height=200&width=200',
          description: '',
          mintAddress
        };
      } catch (error) {
        console.error('Error fetching metadata for token:', mintAddress, error);
        return {
          name: 'Unknown Token',
          symbol: 'Unknown',
          image: '/placeholder.svg?height=200&width=200',
          description: '',
          mintAddress
        };
      }
    };
  
    useEffect(() => {
      const fetchTokens = async () => {
        if (!wallet.publicKey) {
          setLoading(false);
          return;
        }
  
        try {
          const userAddress = wallet.publicKey.toBase58();
          const userDocRef = doc(db, 'tokens', userAddress);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setTokens(userData.tokens || []);
  
            const metadataPromises = userData.tokens.map(fetchMetadata);
            const metadata = await Promise.all(metadataPromises);
            setTokenMetadata(metadata.filter(m => m != null));
          }
        } catch (error) {
          console.error('Error fetching tokens:', error);
          setError('Failed to fetch your tokens. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTokens();
    }, [wallet.publicKey]);
  
    if (wallet.publicKey==null) {
      return( <WalletNotConnected />)
    }
    return (
      <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Your Token Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connected Wallet: {wallet.publicKey!.toBase58().slice(0, 8)}...{wallet.publicKey!.toBase58().slice(-8)}
              </p>
            </CardContent>
          </Card>
  
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading your tokens...</span>
            </div>
          ) : error ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-red-500">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : tokenMetadata.length > 0 ? (
            <AnimatePresence>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {tokenMetadata.map((token) => (
                  <motion.div
                    key={token.mintAddress}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-xl">{token.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Symbol: {token.symbol}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            Description: {token.description || 'No description available'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            Mint Address: {token.mintAddress}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => handleMint(token.mintAddress)}
                          className="w-full"
                        >
                          <Coins className="mr-2 h-4 w-4" />
                          Mint Tokens
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
          <EmptyCollection/>
          )}
        </motion.div>
      </div>
  
      </div>
    );
}

export default DisplayTokens