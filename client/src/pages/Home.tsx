import CallToAction from '@/features/home/CallToAction';
import Features from '@/features/home/Features';
import Hero from '@/features/home/Hero';
import HowItWorks from '@/features/home/HowItWorks';
import Testimonials from '@/features/home/Testimonials';

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CallToAction />
    </>
  );
};
export default Home;
