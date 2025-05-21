'use client'

import { motion } from 'framer-motion'

const AboutPage = () => {
  return (
    <div className="bg-white text-black min-h-screen py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About SoulMint
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          SoulMint was born to empower creators, communities, and culture-shapers to launch their own $Solana tokens — straight from the soul. No fluff. No friction. Just pure token magic in your hands.
        </motion.p>

        <div className="grid gap-10 sm:grid-cols-2">
          <motion.div
            className="p-6 rounded-xl border border-gray-200 shadow-md bg-gray-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Why SoulMint?</h2>
            <p className="text-gray-600">
              We believe every meme, movement, and moment deserves a token. SoulMint lets you mint and move fast without coding or barriers.
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-xl border border-gray-200 shadow-md bg-gray-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600">
              Democratize token creation. Empower the underdog. Bring vibes and velocity to Solana’s token scene. It’s about expression — not permission.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            Built with heart. Powered by Solana. Fueled by soul.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage