'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, Menu, X } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white sticky top-0 z-50 w-full border-b border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Logo and Nav */}
        <div className="flex items-center space-x-6">
          <Link className="flex items-center space-x-2" href="/">
            <img src="/Soul.png" alt="Soul Logo" className="h-20 w-auto ml-4" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/create-mint">Create Token</Link>
            <a href="https://raydium.io/liquidity-pools/" target="_blank" rel="noopener noreferrer">
    Liquidity Pools
  </a>
 
  <Link href="/support">Support</Link>
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Right-aligned Wallet Button */}
        <div className="flex items-center ml-auto">
          <WalletMultiButton />
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white border-t border-gray-800 p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/create-mint" onClick={() => setIsMenuOpen(false)}>Create Mint</Link>
            <Link href="/liquidity-pools" onClick={() => setIsMenuOpen(false)}>Liquidity Pool</Link>
            <Link href="/mint" onClick={() => setIsMenuOpen(false)}>Mint Tokens</Link>
            <Link href="/create-mint" onClick={() => setIsMenuOpen(false)}>Launch Token</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header