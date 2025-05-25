'use client'

import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
        <p className="text-muted-foreground text-center mb-10">
          Please read these terms carefully before using our platform.
        </p>

        <section className="mb-12 space-y-4 text-sm">
          <p>
            By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, please do not use our website or services.
          </p>

          <p>
            Soulmint is a platform that may involve features related to blockchain technology, including cryptocurrencies and tokens. **Cryptocurrency trading and investments are highly volatile and risky.** You acknowledge that you are fully responsible for any financial decisions you make while using our services.
          </p>

          <p>
            We do not provide financial, investment, or legal advice. Nothing on this site should be interpreted as such.
          </p>

          <p>
            We reserve the right to suspend or terminate access to our services at our discretion, without notice.
          </p>

          <p>
            These terms may be updated at any time. Continued use of the platform implies acceptance of any revised terms.
          </p>
        </section>

        <div className="text-center text-sm text-muted-foreground">
          Need help? Reach us at{' '}
          <a href="mailto:legal@soulmint.com" className="text-primary underline">
            legal@soulmint.com
          </a>{' '}
          or visit our{' '}
          <Link href="/privacy-policy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </div>

        <div className="text-center mt-10">
          <Link href="/">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-primary transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}