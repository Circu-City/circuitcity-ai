import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  ShoppingBag,
  Bot,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  onStartTrial: () => void;
}

interface NavbarProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  navigateToAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, isMenuOpen, setIsMenuOpen, navigateToAuth }) => (
  <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'}`}>
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
         <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
           <Bot className="text-dark-navy w-6 h-6" />
         </div>
         <span className="text-2xl font-bold tracking-tight text-dark-navy">
            CircuCity<span className="text-lemon-green">AI</span>
         </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <div className="group relative cursor-pointer">
            <span className="group-hover:text-dark-navy transition-colors">Product</span>
            <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
              <div className="bg-white shadow-xl rounded-2xl p-4 w-48 border border-gray-100">
                <div className="flex flex-col gap-2">
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Features</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Pricing</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Documentation</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">API</a>
                 </div>
              </div>
            </div>
          </div>
          <div className="group relative cursor-pointer">
            <span className="group-hover:text-dark-navy transition-colors">Company</span>
            <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
              <div className="bg-white shadow-xl rounded-2xl p-4 w-48 border border-gray-100">
                <div className="flex flex-col gap-2">
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">About Us</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Blog</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Careers</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Contact</a>
                 </div>
              </div>
            </div>
          </div>
          <div className="group relative cursor-pointer">
            <span className="group-hover:text-dark-navy transition-colors">Legal</span>
            <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
              <div className="bg-white shadow-xl rounded-2xl p-4 w-48 border border-gray-100">
                <div className="flex flex-col gap-2">
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Privacy</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Terms</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">GDPR</a>
                   <a href="#" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">Security</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-dark-navy font-semibold hover:bg-gray-100" onClick={navigateToAuth}>Log In</Button>
          <Button 
            className="bg-lemon-gradient text-dark-navy font-bold hover:opacity-90 shadow-lemon" 
            onClick={navigateToAuth}
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </div>

    {isMenuOpen && (
      <div className="md:hidden absolute top-full left-0 w-full bg-white border-b p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top">
        <a href="#" className="font-medium text-gray-600">Product</a>
        <a href="#" className="font-medium text-gray-600">Company</a>
        <a href="#" className="font-medium text-gray-600">Legal</a>
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button variant="outline" onClick={navigateToAuth}>Log In</Button>
          <Button className="bg-lemon-gradient text-dark-navy font-bold" onClick={navigateToAuth}>Start Free Trial</Button>
        </div>
      </div>
    )}
  </nav>
);

interface HeroProps {
  navigateToAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ navigateToAuth }) => (
  <section className="relative pt-32 pb-20 overflow-hidden bg-dark-navy text-white">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-lemon-gradient opacity-10 blur-[120px] rounded-full -translate-x-1/4 -translate-y-1/4"></div>
    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-lemon-green opacity-5 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4"></div>
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 text-center lg:text-left">
          <Badge className="mb-6 px-4 py-1 bg-lemon-green/20 text-lemon-green border-lemon-green/30 font-semibold tracking-wide">
            ✨ AI-Powered E-commerce Revolution
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Turn Visitors into <br />
            <span className="text-lemon-green italic">Loyal Customers</span> <br />
            with AI Chat.
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The ultimate AI support agent for custom online stores. Personalized, 24/7, and trained on your product data in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button 
              size="lg" 
              className="bg-lemon-gradient text-dark-navy font-bold px-8 py-7 text-lg hover:scale-105 transition-transform shadow-lemon" 
              onClick={navigateToAuth}
            >
              Start 14-Day Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-7 text-lg backdrop-blur-sm" 
              onClick={navigateToAuth}
            >
              Add Free AI Chatbot Now
            </Button>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4 cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-lemon-green/20 transition-colors">
                <Zap className="w-5 h-5 text-lemon-green" />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Watch 60-sec Demo</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="relative z-10 glow-lemon p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="bg-dark-navy rounded-2xl overflow-hidden border border-white/10 shadow-inner relative">
              <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="mx-auto bg-white/10 rounded-md px-3 py-1 text-[10px] text-gray-400 w-1/2 text-center">
                  circucity-store.com/shop
                </div>
              </div>
              <div className="p-6 space-y-6 h-[400px] overflow-hidden bg-gradient-to-b from-dark-navy to-[#111d35]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="text-lemon-green w-6 h-6" />
                  <span className="font-bold">Circu Store</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 p-3">
                      <div className="w-full h-16 bg-white/10 rounded-lg mb-2"></div>
                      <div className="w-2/3 h-3 bg-white/10 rounded mb-2"></div>
                      <div className="w-1/2 h-3 bg-white/10 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden animate-float">
                  <div className="bg-lemon-gradient p-4 flex items-center gap-3">
                    <Bot className="text-dark-navy w-6 h-6" />
                    <span className="font-bold text-dark-navy">AI Shopping Assistant</span>
                  </div>
                  <div className="p-4 space-y-4 bg-white">
                    <div className="bg-gray-100 p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-sm text-gray-700 max-w-[80%]">
                      Hi! I see you're looking at our 4K Monitors. Want to know the best deal today? ⚡️
                    </div>
                    <div className="flex gap-2">
                      <div className="text-[10px] bg-lemon-green/20 text-dark-navy px-2 py-1 rounded-full border border-lemon-green/30 cursor-pointer hover:bg-lemon-green/30">Yes, please!</div>
                      <div className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-200">Just browsing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-lemon-green/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-dark-navy mb-6 tracking-tight">
          Supercharge Your Store's <span className="text-lemon-green italic">Conversion</span>
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Stop losing customers to slow support. CircuCity AI provides instant, accurate, and personalized shopping experiences that drive sales.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Zap className="w-8 h-8" />, title: "Instant Deployment", desc: "One line of JS code. No complex plugins. Live in under 15 minutes.", color: "bg-yellow-100 text-yellow-700" },
          { icon: <Bot className="w-8 h-8" />, title: "Product-Aware AI", desc: "Trained directly on your CSV or JSON catalog. It knows every detail of your stock.", color: "bg-green-100 text-green-700" },
          { icon: <BarChart3 className="w-8 h-8" />, title: "Conversion Analytics", desc: "Real-time insights into what your customers want and where they drop off.", color: "bg-blue-100 text-blue-700" },
          { icon: <MessageSquare className="w-8 h-8" />, title: "Omnichannel Reach", desc: "Seamlessly scale from your store to social media and messaging apps.", color: "bg-purple-100 text-purple-700" },
          { icon: <ShieldCheck className="w-8 h-8" />, title: "Enterprise Security", desc: "GDPR compliant, encrypted data, and secure API integrations by default.", color: "bg-orange-100 text-orange-700" },
          { icon: <Globe className="w-8 h-8" />, title: "Global Scalability", desc: "Automatic translation in 50+ languages to capture international markets.", color: "bg-teal-100 text-teal-700" }
        ].map((feat, idx) => (
          <Card key={idx} className="group border-gray-100 hover:border-lemon-green transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-8">
              <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-dark-navy mb-3">{feat.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

interface PricingProps {
  navigateToAuth: () => void;
}

const Pricing: React.FC<PricingProps> = ({ navigateToAuth }) => (
  <section className="py-24 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-dark-navy mb-6">Simple, Transparent Pricing</h2>
        <p className="text-gray-500">Scale your AI support as your business grows. No hidden fees.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { name: "Starter", price: "0", features: ["1,000 Messages/mo", "1 Store Integration", "Basic AI Training", "Standard Support"], button: "Start Free", featured: false },
          { name: "Growth", price: "49", features: ["10,000 Messages/mo", "3 Store Integrations", "Advanced AI Training", "Priority Support", "Detailed Analytics"], button: "Try 14 Days Free", featured: true },
          { name: "Enterprise", price: "199", features: ["Unlimited Messages", "Unlimited Stores", "Custom LLM Training", "Dedicated Manager", "API Access"], button: "Contact Sales", featured: false }
        ].map((plan, idx) => (
          <div 
            key={idx} 
            className={`relative p-8 rounded-3xl transition-all duration-300 ${plan.featured ? 'bg-dark-navy text-white shadow-2xl scale-105 z-10 border-2 border-lemon-green' : 'bg-white text-dark-navy border border-gray-200 hover:border-lemon-green shadow-sm'}`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lemon-gradient text-dark-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className="mb-8 text-center">
              <h3 className="text-lg font-semibold opacity-80 mb-2">{plan.name}</h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-sm opacity-60">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-lemon-green" />
                  <span className={plan.featured ? 'text-gray-300' : 'text-gray-600'}>{feat}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full py-6 font-bold transition-all ${plan.featured ? 'bg-lemon-gradient text-dark-navy hover:scale-105 shadow-lemon' : 'bg-dark-navy text-white hover:bg-dark-navy/90'}`}
              onClick={navigateToAuth}
            >
              {plan.button}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA: React.FC<PricingProps> = ({ navigateToAuth }) => (
  <section className="py-20 px-6">
    <div className="container mx-auto max-w-6xl bg-dark-navy rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 w-64 h-64 bg-lemon-green/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="relative z-10">
        <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
          Ready to Automate Your <br />
          <span className="text-lemon-green">Customer Support?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Join 2,000+ stores increasing their conversion rates by an average of 24% using CircuCity AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-lemon-gradient text-dark-navy font-bold px-10 py-8 text-xl hover:scale-105 transition-transform shadow-lemon" 
            onClick={navigateToAuth}
          >
            Start Free Trial Now <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/20 text-white hover:bg-white/10 px-10 py-8 text-xl backdrop-blur-sm"
          >
            Book a Demo
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartTrial }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        scrolled={scrolled} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        navigateToAuth={onStartTrial} 
      />
      <Hero navigateToAuth={onStartTrial} />
      <Features />
      <Pricing navigateToAuth={onStartTrial} />
      <CTA navigateToAuth={onStartTrial} />
    </div>
  );
};

export default LandingPage;