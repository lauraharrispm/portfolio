import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import About from "@/components/About";
import Work from "@/components/Work";
import FitAssessment from "@/components/FitAssessment";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <About />
        <Work />
        <FitAssessment />
      </main>
      <Footer />
    </>
  );
}
