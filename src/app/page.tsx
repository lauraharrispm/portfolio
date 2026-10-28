import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AskChat from "@/components/AskChat";
import Services from "@/components/Services";
import HowIWork from "@/components/HowIWork";
import WorkSummary from "@/components/WorkSummary";
import LetsChat from "@/components/LetsChat";
import Footer from "@/components/Footer";

// Read once, server-side, so the flag never reaches the client bundle.
// When false, the section is omitted entirely (not just hidden), so
// there's no leftover #ask anchor or gap between Recent work and Let's chat.
const chatEnabled = process.env.CHAT_ENABLED === "true";

export default function Home() {
  return (
    <>
      <Nav chatEnabled={chatEnabled} />
      <main>
        <Hero />
        <Services />
        <HowIWork />
        <WorkSummary />
        {chatEnabled && <AskChat />}
        <LetsChat />
      </main>
      <Footer />
    </>
  );
}
