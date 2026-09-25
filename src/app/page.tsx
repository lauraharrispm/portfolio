import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import Services from "@/components/Services";
import HowIWork from "@/components/HowIWork";
import WorkSummary from "@/components/WorkSummary";
import LetsChat from "@/components/LetsChat";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Services />
        <HowIWork />
        <WorkSummary />
        <LetsChat />
      </main>
      <Footer />
    </>
  );
}
