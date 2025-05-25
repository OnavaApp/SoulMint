'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white sticky top-0 z-50 w-full border-b border-gray-800">
      <div className="flex h-16 items-center justify-between w-full px-4">
        {/* Left: Logo and Nav */}
        <div className="flex items-center space-x-6">
          <Link className="flex items-center space-x-2" href="/">
            <img src="/Soul.png" alt="Soul Logo" className="h-20 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/create-mint">Create Token</Link>
            <Link href="/liquidity-pools">
  Liquidity Pools
</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>

        {/* Right: Wallet Button */}
        <div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  )
}

export default Header