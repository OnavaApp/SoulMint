// app/faq/page.tsx

export default function FAQPage() {
    return (
      <div className="min-h-screen bg-white text-black px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
  
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">What is SoulMint?</h2>
              <p className="text-muted-foreground">SoulMint is a platform that lets anyone launch their own $Solana token in seconds — no coding needed, just creativity.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Can I customize my token?</h2>
              <p className="text-muted-foreground">Yes! You can set the name, symbol, supply, and even upload your own image.</p>
            </div>

            <div>
            <h2 className="text-xl font-semibold">My token isn’t showing up — what’s going on?</h2>
            <p className="text-muted-foreground">
              Every token you mint is successfully created on-chain. However, due to Solana network congestion or indexing delays, it may take a few minutes — or in rare cases, a couple days — to appear on token lists or explorers. Don’t worry, it’s there.
            </p>
          </div>
  
            <div>
              <h2 className="text-xl font-semibold">Do I need a Solana wallet?</h2>
              <p className="text-muted-foreground">Yes — we recommend using <strong>Phantom</strong> for the smoothest experience.</p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold">Where does my token go after minting?</h2>
              <p className="text-muted-foreground">It goes directly into your connected wallet and is immediately visible on Solana explorers like Solscan.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }