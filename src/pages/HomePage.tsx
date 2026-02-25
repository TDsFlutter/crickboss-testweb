import HeroSection from '../sections/HeroSection/HeroSection';
import AuctionsSection from '../sections/AuctionsSection/AuctionsSection';
import FeaturesSection from '../sections/FeaturesSection/FeaturesSection';
import PricingSection from '../sections/PricingSection/PricingSection';
import FAQSection from '../sections/FAQSection/FAQSection';

export default function HomePage() {
    return (
        <main id="main-content">
            <HeroSection />
            <AuctionsSection variant="today" limit={4} />
            <AuctionsSection variant="upcoming" limit={3} />
            <FeaturesSection />
            <PricingSection />
            <FAQSection limit={6} />
        </main>
    );
}
