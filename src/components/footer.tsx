'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-lg mb-2">SoulMint</h3>
            <p className="text-gray-600">
              Launch your $Solana token — straight from the soul.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Product</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="/create-mint" className="hover:text-black">Create Token</Link></li>
              <li><Link href="/#features" className="hover:text-black">Features</Link></li>
              <li><Link href="/faq" className="hover:text-black">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Company</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="/about" className="hover:text-black">About</Link></li>
              <li><Link href="/support" className="hover:text-black">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Legal</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="/TermsOfService" className="hover:text-black">Terms of Service</Link></li>
              <li><Link href="/PrivacyPolicy" className="hover:text-black">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SoulMint. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer