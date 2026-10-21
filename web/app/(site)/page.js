import { Manrope } from "next/font/google";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Sectors from "@/components/home/Sectors";
import Services from "@/components/home/Services";
import Hub from "@/components/home/Hub";
import Membership from "@/components/home/Membership";
import News from "@/components/home/News";
import Partnerships from "@/components/home/Partnerships";
import Contact from "@/components/home/Contact";
import SiteFooter from "@/components/home/SiteFooter";
import HomeEffects from "@/components/home/HomeEffects";
import "@/styles/home.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
    title: "Shagar Chamber of Commerce & Sectoral Association",
    description:
        "Shagar Chamber of Commerce & Sectoral Association - Connecting businesses, creating opportunities and supporting economic growth.",
    authors: [{ name: "Shagar Chamber of Commerce & Sectoral Association" }]
};

export default function HomePage() {
    return (
        <div className={`sc-home ${manrope.variable}`}>
            <SiteHeader />
            <main>
                <Hero />
                <About />
                <Sectors />
                <Services />
                <Hub />
                <Membership />
                <News />
                <Partnerships />
                <Contact />
            </main>
            <SiteFooter />
            <HomeEffects />
        </div>
    );
}
