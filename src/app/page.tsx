import AboutMe from "@/components/AboutMe";
import Feature from "@/components/Feature";
import HeroSection from "@/components/HeroSection";
import Story from "@/components/Story";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900/30 to-indigo-900/30">
     <HeroSection />
    <AboutMe />
    <Story />
    <Feature />
    </main>
  );
}
