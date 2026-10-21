import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import About from "@/components/home/About";
import MissionVision from "@/components/home/MissionVision";
import Values from "@/components/home/Values";
import Sectors from "@/components/home/Sectors";
import Services from "@/components/home/Services";
import Opportunities from "@/components/home/Opportunities";
import Jobs from "@/components/home/Jobs";
import Membership from "@/components/home/Membership";
import Events from "@/components/home/Events";
import Expo from "@/components/home/Expo";
import News from "@/components/home/News";
import Partnerships from "@/components/home/Partnerships";
import FinalCta from "@/components/home/FinalCta";
import Contact from "@/components/home/Contact";
import SiteFooter from "@/components/home/SiteFooter";
import HomeEffects from "@/components/home/HomeEffects";

export const metadata = {
    title: "Shagar Chamber of Commerce & Sectoral Association",
    description:
        "Shagar Chamber of Commerce & Sectoral Association - Connecting businesses, creating opportunities and supporting economic growth.",
    authors: [{ name: "Shagar Chamber of Commerce & Sectoral Association" }]
};

export default function HomePage() {
    return (
        <>
            <SiteHeader />
            <main>
                <Hero />
                <Statistics />
                <About />
                <MissionVision />
                <Values />
                <Sectors />
                <Services />
                <Opportunities />
                <Jobs />
                <Membership />
                <Events />
                <Expo />
                <News />
                <Partnerships />
                <FinalCta />
                <Contact />
            </main>
            <SiteFooter />
            <HomeEffects />
        </>
    );
}
