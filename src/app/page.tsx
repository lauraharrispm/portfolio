import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import Services from "@/components/Services";
import HowIWork from "@/components/HowIWork";
import Work from "@/components/Work";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <WhoThisIsFor />
        <Services />
        <HowIWork />
        <Work />
        {/* #book lands here — Phase 5 */}
      </main>
      <Footer />
    </>
  );
}
