import { SimplifiedHeroSection } from '@/components/home/SimplifiedHeroSection';
import { SimplifiedFeaturesSection } from '@/components/home/SimplifiedFeaturesSection';
import { SimplifiedHowItWorksSection } from '@/components/home/SimplifiedHowItWorksSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SimplifiedHeroSection />
      
      {/* Features Section */}
      <SimplifiedFeaturesSection />
      
      {/* How It Works Section */}
      <SimplifiedHowItWorksSection />
    </div>
  );
}
