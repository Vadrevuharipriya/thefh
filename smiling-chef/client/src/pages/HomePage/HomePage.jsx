import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import StatsStrip from '../../components/StatsStrip/StatsStrip';
import OccasionsSection from '../../components/OccasionsSection/OccasionsSection';
import ProfessionalsSection from '../../components/ProfessionalsSection/ProfessionalsSection';
import CuisinesSection from '../../components/CuisinesSection/CuisinesSection';
import HowItWorksSection from '../../components/HowItWorksSection/HowItWorksSection';
import GoogleReviewsSection from '../../components/GoogleReviewsSection/GoogleReviewsSection';
import CitiesSection from '../../components/CitiesSection/CitiesSection';
import { initHomeData } from '../../data/homeData';
import { useEffect } from 'react';
import './HomePage.scss';

export default function HomePage() {
  useEffect(() => {
    initHomeData();
  }, []);

  return (
    <main className="home-page">
      <HeroCarousel />
      <OccasionsSection />
      <ProfessionalsSection />
      <CuisinesSection />
      <HowItWorksSection />
      <GoogleReviewsSection />
      <CitiesSection />
    </main>
  );
}
