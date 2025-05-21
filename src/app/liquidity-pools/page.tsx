'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const pools = [
  {
    id: 1,
    pair: 'SOL/USDC',
    liquidity: '$1.2M',
    volume: '$450K',
    apr: '12.5%',
    fees: '$1.3K/day',
  },
  {
    id: 2,
    pair: 'BONK/SOL',
    liquidity: '$500K',
    volume: '$120K',
    apr: '18.4%',
    fees: '$800/day',
  },
  {
    id: 3,
    pair: 'WIF/USDC',
    liquidity: '$800K',
    volume: '$230K',
    apr: '14.1%',
    fees: '$1K/day',
  },
]

export default function LiquidityPools() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Liquidity Pools</h1>
      <div className="grid gap-6">
        {pools.map((pool) => (
          <Card key={pool.id} className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <div className="text-xl font-semibold">{pool.pair}</div>
                <div className="text-sm text-gray-400">Liquidity: {pool.liquidity}</div>
                <div className="text-sm text-gray-400">Volume 24h: {pool.volume}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Fees Earned: {pool.fees}</div>
                <div className="text-sm text-gray-400">APR: <span className="text-green-400 font-medium">{pool.apr}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="default">Add</Button>
                <Button variant="outline">Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
