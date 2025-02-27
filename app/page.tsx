"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Menu, X, Mic, FileAudio, Headphones, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import Image from "next/image";
import Link from "next/link";

type LandingPageContent = {
  navItems: string[];
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  features: {
    title: string;
    description: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  pricing: {
    title: string;
    description: string;
    plans: {
      name: string;
      price: number;
      features: string[];
      ctaText: string;
      popular?: boolean;
    }[];
  };
  testimonials: {
    title: string;
    items: {
      content: string;
      author: string;
      role: string;
      avatar: string;
    }[];
  };
  integrations: {
    title: string;
    description: string;
    partners: string[];
  };
  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  cta: {
    title: string;
    description: string;
    ctaText: string;
  };
  demo: {
    title: string;
    description: string;
    fields: {
      name: string;
      placeholder: string;
      type: string;
    }[];
    ctaText: string;
  };
};

const sampleContent: LandingPageContent = {
  navItems: ["Features", "Pricing", "Testimonials", "GitHub"],
  hero: {
    headline: "Transform Speech to Text with Whisper.dev",
    subheadline:
      "Open-source voice transcription that's accurate, fast, and accessible for developers and users alike",
    ctaText: "Try for free",
  },
  features: {
    title: "Powerful Voice Transcription Features",
    description:
      "Whisper.dev offers state-of-the-art speech recognition technology in a simple, open-source package.",
    items: [
      {
        icon: "🎯",
        title: "High Accuracy Transcription",
        description:
          "Industry-leading speech recognition accuracy across multiple languages and accents.",
      },
      {
        icon: "⚡",
        title: "Real-Time Processing",
        description:
          "Convert speech to text in real-time with minimal latency for immediate results.",
      },
      {
        icon: "🔌",
        title: "Developer-Friendly API",
        description:
          "Simple integration with your applications through our well-documented API.",
      },
      {
        icon: "🌐",
        title: "Multi-Language Support",
        description:
          "Transcribe audio in over 50 languages with automatic language detection.",
      },
    ],
  },
  pricing: {
    title: "Open Source & Free",
    description: "Bring your own OpenAI API key and get unlimited transcriptions",
    plans: [
      {
        name: "Free Version",
        price: 0,
        features: [
          "Unlimited transcriptions",
          "Bring your own API key", 
          "MIT Licensed",
          "Full source code access",
          "1 Click Deployment to Vercel",
          "Community support"
        ],
        ctaText: "Get Started",
      }
    ],
  },
  testimonials: {
    title: "Community Feedback",
    items: [
      {
        content:
          "Whisper.dev has transformed our podcast production workflow. The transcription accuracy is incredible.",
        author: "Alex Chen",
        role: "Podcast Producer",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        content:
          "As a developer, I appreciate how easy it was to integrate Whisper.dev into our accessibility tools.",
        author: "Maya Patel",
        role: "Software Engineer",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        content:
          "The multi-language support has been a game-changer for our international content team.",
        author: "Thomas Weber",
        role: "Content Director",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  integrations: {
    title: "Works With Your Stack",
    description:
      "Whisper.dev integrates seamlessly with popular development tools and platforms",
    partners: [
      "React",
      "Node.js",
      "Python",
      "Docker",
      "VS Code",
      "Jupyter",
      "GitHub Actions",
      "AWS",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is Whisper.dev really free to use?",
        answer:
          "Yes, Whisper.dev is completely free and open-source under the MIT license. You can use it for personal or commercial projects without restrictions.",
      },
      {
        question: "How accurate is the speech recognition?",
        answer:
          "Whisper.dev achieves state-of-the-art accuracy rates across multiple languages and can handle various accents, background noise, and technical terminology.",
      },
      {
        question: "Can I contribute to the project?",
        answer:
          "Absolutely! We welcome contributions from the community. Check out our GitHub repository for contribution guidelines and open issues.",
      },
      {
        question: "What languages are supported?",
        answer:
          "Whisper.dev supports over 50 languages including English, Spanish, French, German, Japanese, Chinese, and many more, with automatic language detection.",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Speech to Text?",
    description:
      "Join our open-source community and start using Whisper.dev today.",
    ctaText: "Get Started Now",
  },
  demo: {
    title: "Try Whisper.dev",
    description:
      "Upload an audio file or record your voice to see Whisper.dev in action.",
    fields: [
      { name: "name", placeholder: "Your Name (optional)", type: "text" },
      { name: "email", placeholder: "Your Email (optional)", type: "email" },
      { name: "audioFile", placeholder: "Upload Audio File", type: "file" },
      { name: "message", placeholder: "Feedback (optional)", type: "textarea" },
    ],
    ctaText: "Transcribe Now",
  },
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial] = useState(0);
  const content: LandingPageContent = sampleContent;

  useEffect(() => {
    const handleResize = () => setIsMenuOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-[#333333]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white flex items-center">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="whisperLogoTitle"
            >
              <title id="whisperLogoTitle">Whisper.dev Logo</title>
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12a4 4 0 0 1 8 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 12a4 4 0 0 1-8 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Whisper.dev
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          <ul
            className={`md:flex space-y-4 md:space-y-0 md:space-x-6 ${
              isMenuOpen ? "block" : "hidden"
            } absolute md:relative top-full left-0 right-0 bg-[#000000] md:bg-transparent p-4 md:p-0`}
          >
            {content.navItems.map((item) => (
              <li key={`nav-${item.toLowerCase()}`}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <Button className="md:flex md:items-center bg-[#333333] hover:bg-[#4D4D4D] text-white rounded-full px-3 md:px-6 py-2 transition-all duration-300 border border-[#666666]">
            <Github className="w-4 h-4 md:mr-2" />
            <span className="hidden md:block">GitHub</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#333333] via-[#1A1A1A] to-[#000000] opacity-60" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FFFFFF] to-[#B3B3B3]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {content.hero.headline}
          </motion.h1>
          <p className="text-xl mb-8 text-[#B3B3B3] max-w-2xl mx-auto">
            {content.hero.subheadline}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="mx-auto bg-[#333333] hover:bg-[#4D4D4D] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 border border-[#666666] flex items-center">
              <Link href="/app" className="flex items-center"><Mic className="w-5 h-5 mr-2" />{content.hero.ctaText}</Link>
            </Button>
          </motion.div>
        </div>
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="/hero-light.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#1A1A1A]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.features.title}
          </h2>
          <p className="text-xl text-center mb-12 text-[#999999]">
            {content.features.description}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, i) => (
              <motion.div
                key={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-[#262626] p-6 rounded-lg border border-[#333333] shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#B3B3B3]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#333333] via-[#1A1A1A] to-[#000000] opacity-60" />
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.pricing.title}
          </h2>
          <p className="text-xl text-center mb-12 text-[#B3B3B3]">
            {content.pricing.description}
          </p>
          <div className="flex justify-center">
            <div className="grid md:grid-cols-1 gap-8 max-w-md">
              {content.pricing.plans.map((plan, i) => (
                <motion.div
                  key={`plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`bg-[#1A1A1A] p-8 rounded-lg ${
                    plan.popular
                      ? "border-2 border-[#FFFFFF]"
                      : "border border-[#333333]"
                  } shadow-lg relative overflow-hidden`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#FFFFFF] text-[#000000] text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Recommended
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-center">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-6 text-center">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                    {plan.price > 0 && <span className="text-xl font-normal">/mo</span>}
                  </div>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={`${plan.name.toLowerCase()}-feature-${feature.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center text-[#B3B3B3]">
                        <Check className="w-5 h-5 mr-2 text-[#FFFFFF]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-center">
                    <Button
                      className={`${
                        plan.popular
                          ? "bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000]"
                          : "bg-[#333333] hover:bg-[#4D4D4D] text-white"
                      } rounded-full py-2 transition-all duration-300 border ${plan.popular ? "border-[#FFFFFF]" : "border-[#666666]"}`}
                    >
                      {i === 2 ? <Github className="w-4 h-4 mr-2" /> : i === 1 ? <FileAudio className="w-4 h-4 mr-2" /> : <Headphones className="w-4 h-4 mr-2" />}
                      {plan.ctaText}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#000000]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {content.testimonials.title}
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-all duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {content.testimonials.items.map((testimonial) => (
                  <div key={`testimonial-${testimonial.author.toLowerCase().replace(/\s+/g, '-')}`} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#333333] shadow-lg">
                      <p className="text-lg mb-4 italic text-[#B3B3B3]">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="rounded-full mr-4 border border-[#333333]"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-[#999999]">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            {/* ... existing buttons ... */}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.integrations.title}
          </h2>
          <p className="text-xl text-center mb-12 text-[#999999]">
            {content.integrations.description}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {content.integrations.partners.map((partner) => (
              <div
                key={`partner-${partner.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-')}`}
                className="bg-[#262626] p-4 rounded-lg border border-[#333333] shadow-lg"
              >
                <Image
                  src={`/placeholder.svg?height=60&width=120&text=${partner}`}
                  alt={partner}
                  width={120}
                  height={60}
                  className="h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-[#000000]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {content.faq.title}
          </h2>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {content.faq.items.map((item, i) => (
              <AccordionItem
                key={`faq-${item.question.toLowerCase().substring(0, 20).replace(/\s+/g, '-')}`}
                value={`item-${i}`}
                className="border-b border-[#333333]"
              >
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#B3B3B3]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-[#333333]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.cta.title}
          </h2>
          <p className="text-xl mb-8 text-[#B3B3B3]">{content.cta.description}</p>
          <Button
            size="lg"
            className="bg-[#FFFFFF] text-[#000000] hover:bg-[#B3B3B3] px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center mx-auto"
          >
            <Mic className="w-5 h-5 mr-2" />
            {content.cta.ctaText}
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      <section id="contact" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#333333] via-[#1A1A1A] to-[#000000] opacity-60" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto bg-[#1A1A1A] p-8 rounded-lg border border-[#333333] shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#333333]/10 to-[#666666]/10 opacity-50" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">
              {content.demo.title}
            </h2>
            <p className="text-[#B3B3B3] mb-6 relative z-10">
              {content.demo.description}
            </p>
            <form className="space-y-4 relative z-10">
              {content.demo.fields.map((field) => (
                <div key={`field-${field.name}-${field.type}`}>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-[#262626] rounded-lg border border-[#333333] focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF] transition-all duration-300 text-white placeholder-[#999999]"
                      rows={4}
                    />
                  ) : field.type === "file" ? (
                    <div className="w-full p-3 bg-[#262626] rounded-lg border border-[#333333] focus-within:border-[#FFFFFF] focus-within:ring-1 focus-within:ring-[#FFFFFF] transition-all duration-300 flex items-center">
                      <FileAudio className="w-5 h-5 mr-2 text-[#999999]" />
                      <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="border-0 bg-transparent text-white placeholder-[#999999] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  ) : (
                    <Input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-[#262626] rounded-lg border border-[#333333] focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF] transition-all duration-300 text-white placeholder-[#999999]"
                    />
                  )}
                </div>
              ))}
              <Button className="w-full bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000] rounded-full py-3 transition-all duration-300 flex items-center justify-center">
                <Headphones className="w-5 h-5 mr-2" />
                {content.demo.ctaText}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] py-12 px-4 border-t border-[#333333]">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white flex items-center mb-4">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-labelledby="whisperLogoFooter"
              >
                <title id="whisperLogoFooter">Whisper.dev Logo</title>
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12a4 4 0 0 1 8 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 12a4 4 0 0 1-8 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Whisper.dev
            </div>
            <p className="text-[#999999]">
              Whisper.dev is an open-source voice transcription tool that transforms speech to text with high accuracy.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {content.navItems.map((item) => (
                <li key={`footer-nav-${item.toLowerCase()}`}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-[#999999] hover:text-[#FFFFFF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-[#999999]">GitHub: github.com/justmalhar/whisper-dev</p>
            <p className="text-[#999999] mt-2">Twitter: @whisper_dev</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#262626] border-[#333333] text-white placeholder-[#999999] focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF]"
              />
              <Button
                type="submit"
                className="bg-[#333333] hover:bg-[#4D4D4D] text-white border border-[#666666]"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-[#333333] text-center text-[#999999]">
          <p>&copy; {new Date().getFullYear()} Whisper.dev. Open-source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
