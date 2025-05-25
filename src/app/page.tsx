import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/Home/hero-section'
import FeaturesSection from '@/components/Home/features-section'
import CtaSection from '@/components/Home/cta-section'
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </div>
  )
}
