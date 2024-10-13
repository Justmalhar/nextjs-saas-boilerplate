"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Menu, X } from "lucide-react";
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
  navItems: ["Home", "Features", "Pricing", "Testimonials", "Contact"],
  hero: {
    headline: "Elevate Your Business with CloudPeak",
    subheadline:
      "Streamline your workflow, boost productivity, and scale your operations with our cutting-edge SaaS solution",
    ctaText: "Start Free Trial",
  },
  features: {
    title: "Powerful Features to Supercharge Your Workflow",
    description:
      "CloudPeak offers a comprehensive suite of tools designed to enhance your productivity and streamline your business processes.",
    items: [
      {
        icon: "🚀",
        title: "Lightning-Fast Performance",
        description:
          "Experience unparalleled speed and efficiency in all your operations.",
      },
      {
        icon: "🔒",
        title: "Bank-Grade Security",
        description:
          "Rest easy knowing your data is protected by state-of-the-art security measures.",
      },
      {
        icon: "🔄",
        title: "Seamless Integrations",
        description:
          "Connect with your favorite tools and services for a unified workflow.",
      },
      {
        icon: "📊",
        title: "Advanced Analytics",
        description:
          "Gain deep insights into your business performance with our powerful analytics tools.",
      },
    ],
  },
  pricing: {
    title: "Flexible Pricing Plans",
    description: "Choose the perfect plan for your business needs",
    plans: [
      {
        name: "Starter",
        price: 49,
        features: [
          "Up to 5 users",
          "10GB storage",
          "Basic analytics",
          "Email support",
        ],
        ctaText: "Start Free Trial",
      },
      {
        name: "Professional",
        price: 99,
        features: [
          "Up to 20 users",
          "50GB storage",
          "Advanced analytics",
          "Priority support",
        ],
        ctaText: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: 199,
        features: [
          "Unlimited users",
          "500GB storage",
          "Custom analytics",
          "24/7 dedicated support",
        ],
        ctaText: "Contact Sales",
      },
    ],
  },
  testimonials: {
    title: "What Our Customers Say",
    items: [
      {
        content:
          "CloudPeak has revolutionized the way we manage our projects. The efficiency gains are truly remarkable.",
        author: "Jane Cooper",
        role: "CEO, TechCorp",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        content:
          "The analytics features have given us invaluable insights into our business operations. Highly recommended!",
        author: "Alex Johnson",
        role: "CTO, InnovateCo",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        content:
          "Customer support is top-notch. They're always there when we need them, no matter the issue.",
        author: "Sarah Williams",
        role: "Operations Manager, GlobalTech",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  integrations: {
    title: "Seamless Integrations",
    description:
      "CloudPeak works harmoniously with your favorite tools and services",
    partners: [
      "Slack",
      "Google Workspace",
      "Microsoft 365",
      "Salesforce",
      "Jira",
      "Zendesk",
      "GitHub",
      "Trello",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How does the free trial work?",
        answer:
          "Our free trial gives you full access to all features for 14 days. No credit card required.",
      },
      {
        question: "Can I integrate CloudPeak with my existing tools?",
        answer:
          "Yes, CloudPeak offers seamless integration with a wide range of popular business tools and platforms.",
      },
      {
        question: "Is my data secure with CloudPeak?",
        answer:
          "Absolutely. We use industry-leading encryption and security measures to protect your data.",
      },
      {
        question: "Do you offer customer support?",
        answer:
          "Yes, we provide 24/7 customer support via chat, email, and phone for all our customers.",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Business?",
    description:
      "Join thousands of satisfied customers and start your journey with CloudPeak today.",
    ctaText: "Start Your Free Trial",
  },
  demo: {
    title: "Request a Free Demo",
    description:
      "See the power of CloudPeak in action. Schedule your personalized demo today.",
    fields: [
      { name: "name", placeholder: "Your Name", type: "text" },
      { name: "email", placeholder: "Your Email", type: "email" },
      { name: "company", placeholder: "Company Name", type: "text" },
      { name: "message", placeholder: "Your Message", type: "textarea" },
    ],
    ctaText: "Schedule Demo",
  },
};

export default function Home({
  content = sampleContent,
}: {
  content?: LandingPageContent;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMenuOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-md border-b border-[#1e2433]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white flex items-center">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            CloudPeak
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
            } absolute md:relative top-full left-0 right-0 bg-[#030712] md:bg-transparent p-4 md:p-0`}
          >
            {content.navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <Button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#030712] to-[#030712] opacity-60" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {content.hero.headline}
          </motion.h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {content.hero.subheadline}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              {content.hero.ctaText}
            </Button>
          </motion.div>
        </div>
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0d1117]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.features.title}
          </h2>
          <p className="text-xl text-center mb-12 text-gray-400">
            {content.features.description}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1a202c] p-6 rounded-lg border border-[#2d3748] shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#030712] to-[#030712] opacity-60" />
        </div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.pricing.title}
          </h2>
          <p className="text-xl text-center mb-12 text-gray-300">
            {content.pricing.description}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {content.pricing.plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-[#0d1117] p-8 rounded-lg ${
                  plan.popular
                    ? "border-2 border-blue-500"
                    : "border border-[#1e2433]"
                } shadow-lg relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plan.price}
                  <span className="text-xl font-normal">/mo</span>
                </div>
                <ul className="mb-8 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 mr-2 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#1e2433] hover:bg-[#2a3441]"
                  } text-white rounded-full py-2 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                >
                  {plan.ctaText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#0d1117]">
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
                {content.testimonials.items.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#1a202c] p-8 rounded-lg border border-[#2d3748] shadow-lg">
                      <p className="text-lg mb-4 italic">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="rounded-full mr-4"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-gray-400">{testimonial.role}</p>
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
      <section className="py-20 px-4 bg-[#030712]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.integrations.title}
          </h2>
          <p className="text-xl text-center mb-12 text-gray-400">
            {content.integrations.description}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {content.integrations.partners.map((partner, index) => (
              <div
                key={index}
                className="bg-[#1a202c] p-4 rounded-lg border border-[#2d3748] shadow-lg"
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
      <section id="faq" className="py-20 px-4 bg-[#0d1117]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {content.faq.title}
          </h2>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {content.faq.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#2d3748]"
              >
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.cta.title}
          </h2>
          <p className="text-xl mb-8">{content.cta.description}</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300"
          >
            {content.cta.ctaText}
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      <section id="contact" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900 via-[#030712] to-[#030712] opacity-60" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto bg-[#0d1117] p-8 rounded-lg border border-[#1e2433] shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">
              {content.demo.title}
            </h2>
            <p className="text-gray-300 mb-6 relative z-10">
              {content.demo.description}
            </p>
            <form className="space-y-4 relative z-10">
              {content.demo.fields.map((field, index) => (
                <div key={index}>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-[#1e2433] rounded-lg border border-[#2a3441] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                      rows={4}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-[#1e2433] rounded-lg border border-[#2a3441] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                    />
                  )}
                </div>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                {content.demo.ctaText}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d1117] py-12 px-4 border-t border-[#1e2433]">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white flex items-center mb-4">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              CloudPeak
            </div>
            <p className="text-gray-400">
              CloudPeak is revolutionizing the way businesses operate with our
              cutting-edge SaaS solutions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {content.navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: info@cloudpeak.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1e2433] border-[#2a3441] text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-[#1e2433] text-center text-gray-400">
          <p>&copy; 2024 CloudPeak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
