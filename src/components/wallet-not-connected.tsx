import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


const WalletNotConnected = () => {
    return (
        <div className="container mx-auto px-4 py-8">
          
  
  
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please connect your wallet to view your token collection.</p>
            </CardContent>
          </Card>
        </div>
      );
    }


export default WalletNotConnected