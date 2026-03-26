import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SimulationSection from "@/components/SimulationSection";
import ModelsSection from "@/components/ModelsSection";
import RoadmapSection from "@/components/RoadmapSection";
import TeamSection from "@/components/TeamSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <SimulationSection />
      <ModelsSection />
      <RoadmapSection />
      <TeamSection />
      <FooterSection />
    </div>
  );
};

export default Index;
