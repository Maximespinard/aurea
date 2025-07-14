import CallToAction from '@/features/Home/CallToAction';
import Features from '@/features/Home/Features';
import Hero from '@/features/Home/Hero';
import HowItWorks from '@/features/Home/HowItWorks';
import Testimonials from '@/features/Home/Testimonials';

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
