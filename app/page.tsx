import { About } from "@/components/public/About";
import { Faq } from "@/components/public/Faq";
import { Hero } from "@/components/public/Hero";
import { MapSection } from "@/components/public/MapSection";
import { Marquee } from "@/components/public/Marquee";
import { PortfolioSection } from "@/components/public/PortfolioSection";
import { Process } from "@/components/public/Process";
import { Quote } from "@/components/public/Quote";
import { Restoration } from "@/components/public/Restoration";
import { Services } from "@/components/public/Services";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Testimonials } from "@/components/public/Testimonials";
import { TopBar } from "@/components/public/TopBar";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";
import { getPortfolio } from "@/lib/portfolio";
import { SHOW_TESTIMONIALS } from "@/lib/site";

export default async function HomePage() {
  const portfolio = await getPortfolio();

  return (
    <>
      <TopBar />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <PortfolioSection {...portfolio} />
        <Services />
        <Process />
        <Restoration />
        <About />
        {SHOW_TESTIMONIALS && <Testimonials />}
        <Faq />
        <Quote />
        <MapSection />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
