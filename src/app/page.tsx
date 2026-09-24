import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import Work from "@/components/Work";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        {/* #fit, #services, #how land here — Phase 3 */}
        <Work />
        {/* #book lands here — Phase 5 */}
      </main>
      <Footer />
    </>
  );
}
