import PageShell from "@/components/shared/PageShell"
import HeroSection from "@/components/landing/HeroSection"
import AboutSection from "@/components/landing/AboutSection"
import TimelineSection from "@/components/landing/TimelineSection"
import PrizesSection from "@/components/landing/PrizesSection"
import SponsorsSection from "@/components/landing/SponsorsSection"
import FAQSection from "@/components/landing/FAQSection"
import { hackathons } from "@/lib/mockData"

export default function Landing() {
  const featured = hackathons.find(h => h.status === "active") || hackathons[0]
  return (
    <PageShell>
      <HeroSection hackathon={featured} />
      <AboutSection />
      <TimelineSection hackathon={featured} />
      <PrizesSection hackathon={featured} />
      <SponsorsSection sponsors={featured?.sponsors} />
      <FAQSection faqs={featured?.faqs} />
    </PageShell>
  )
}
