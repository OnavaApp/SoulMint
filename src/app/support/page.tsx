'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // You can add your actual submission logic here
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {submitted ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Thanks for reaching out! 🙏</h1>
            <p className="text-muted-foreground mb-6">
              We’ve received your message and will get back to you shortly.
              In the meantime, check out our{' '}
              <Link href="/faq" className="text-primary underline">
                FAQ page
              </Link>{' '}
              for answers to common questions.
            </p>
            <Link href="/">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-primary transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center">Need Help?</h1>
            <p className="text-muted-foreground text-center mb-10">
              If you're experiencing issues or have any questions, we’re here for you. Use the form below or reach out directly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us what’s going on..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-primary transition-all"
              >
                Send Message
              </button>
            </form>

            <div className="mt-10 text-center text-sm text-muted-foreground">
              You can also reach us at{' '}
              <a href="mailto:support@soulmint.com" className="text-primary underline">
                support@soulmint.com
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}