'use client'

import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-muted-foreground text-center mb-10">
          We respect your privacy and are committed to protecting your personal data.
        </p>

        <section className="mb-12 space-y-4 text-sm">
          <p>
            We collect personal information (like your name and email) only when you voluntarily provide it through forms on our site.
          </p>

          <p>
            We may use cookies and similar tracking technologies to improve user experience and understand site traffic.
          </p>

          <p>
            We do not share, sell, or rent your personal information to third parties.
          </p>

          <p>
            You have the right to access, modify, or delete your personal data. Contact us at{' '}
            <a href="mailto:privacy@soulmint.com" className="text-primary underline">
              privacy@soulmint.com
            </a>{' '}
            to request changes.
          </p>

          <p>
            This policy may be updated occasionally. We encourage you to review it regularly.
          </p>
        </section>

        <div className="text-center text-sm text-muted-foreground">
          Questions? Contact{' '}
          <a href="mailto:privacy@soulmint.com" className="text-primary underline">
            privacy@soulmint.com
          </a>{' '}
          or check our{' '}
          <Link href="/terms-of-service" className="text-primary underline">
            Terms of Service
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