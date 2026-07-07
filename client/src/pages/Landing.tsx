import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Display, Headline, Lead, Body, Caption } from "@/components/shared/Typography";
import { Typewriter, BlinkingCursor, CountUp } from "@/components/shared/AnimatedText";
import {
  Zap,
  Bookmark,
  Sparkles,
  TrendingUp,
  Search,
  Brain,
  ArrowRight,
  Github,
} from "lucide-react";
import { useLocation } from "wouter";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

function HeroSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const [, navigate] = useLocation();

  const topics = ["Technology", "AI", "Business", "Science", "Health"];
  const [currentTopic, setCurrentTopic] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        className="text-center max-w-4xl"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="mb-8">
          <Display className="mb-4">
            Understand Today's News
          </Display>
          <motion.div className="h-12 flex items-center justify-center">
            <motion.span
              key={currentTopic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="font-serif text-3xl md:text-4xl font-bold text-foreground/60"
            >
              {topics[currentTopic]}
            </motion.span>
          </motion.div>
        </motion.div>

        <Lead className="mb-8 text-foreground/70">
          The fastest way to understand today's news. Browse, summarize, and stay informed with AI-powered insights.
        </Lead>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/home")}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Start Reading
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/home")}
          >
            Explore News
          </Button>
        </motion.div>

        <motion.div
          className="text-foreground/40 text-sm"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓ Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Summaries",
      description: "Get instant, comprehensive summaries of any article powered by advanced AI.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you're looking for with powerful search and filters.",
    },
    {
      icon: Bookmark,
      title: "Organize & Bookmark",
      description: "Save articles to folders and build your personal news library.",
    },
    {
      icon: TrendingUp,
      title: "Trending News",
      description: "Stay on top of what's trending across multiple categories.",
    },
    {
      icon: Brain,
      title: "Smart Insights",
      description: "Get sentiment analysis, bias detection, and key takeaways.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with instant results and smooth interactions.",
    },
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Headline className="mb-4">Powerful Features</Headline>
          <Lead className="text-foreground/60">
            Everything you need to stay informed and make better decisions.
          </Lead>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={staggerContainer}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="p-6 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <Icon className="w-8 h-8 mb-4 text-foreground/60" />
                <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
                <Caption className="text-foreground/60">{feature.description}</Caption>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { number: "1", title: "Browse", description: "Explore news from multiple sources and categories" },
    { number: "2", title: "Read", description: "Click any article to read the full story" },
    { number: "3", title: "Summarize", description: "Get AI-powered summaries in seconds" },
  ];

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Headline className="mb-4">How It Works</Headline>
          <Lead className="text-foreground/60">
            Three simple steps to understand the news better.
          </Lead>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={staggerContainer}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="relative" variants={fadeInUp}>
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-serif text-2xl font-bold mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="font-serif text-lg font-semibold mb-2">{step.title}</h3>
                <Caption className="text-center text-foreground/60">{step.description}</Caption>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-border" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Articles Indexed", value: 50000 },
    { label: "Summaries Generated", value: 100000 },
    { label: "News Sources", value: 500 },
    { label: "Active Users", value: 10000 },
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl">
        <motion.div
          className="grid md:grid-cols-4 gap-8"
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
            >
              <motion.div className="font-serif text-4xl md:text-5xl font-bold mb-2">
                {inView && (
                  <CountUp to={stat.value} duration={2} delay={index * 0.2} suffix="+" />
                )}
              </motion.div>
              <Caption className="text-foreground/60">{stat.label}</Caption>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "How does AI summarization work?",
      answer: "Our AI analyzes article content and generates comprehensive summaries with key insights, sentiment analysis, and important entities.",
    },
    {
      question: "Can I bookmark articles?",
      answer: "Yes! Bookmark any article and organize them into folders for easy access later.",
    },
    {
      question: "Is my data private?",
      answer: "All your data is stored locally in your browser. We don't collect or store any personal information.",
    },
    {
      question: "What sources are included?",
      answer: "We aggregate news from hundreds of sources across multiple countries and languages.",
    },
    {
      question: "Can I search articles?",
      answer: "Yes, use our powerful search with filters for country, language, category, and more.",
    },
    {
      question: "Is there a cost?",
      answer: "Narrate is completely free to use. No subscriptions or hidden fees.",
    },
  ];

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container max-w-3xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Headline className="mb-4">Frequently Asked Questions</Headline>
          <Lead className="text-foreground/60">
            Find answers to common questions about Narrate.
          </Lead>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-semibold hover:text-foreground/70">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-border py-12 px-4 bg-muted/20">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-serif font-semibold mb-4">Narrate</h4>
            <Caption className="text-foreground/60">
              The fastest way to understand today's news.
            </Caption>
          </div>
          <div>
            <h5 className="font-semibold text-sm mb-4">Product</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Features</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Pricing</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm mb-4">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">About</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Contact</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm mb-4">Follow</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex justify-between items-center">
          <Caption className="text-foreground/50">
            © 2026 Narrate. All rights reserved.
          </Caption>
          <Caption className="text-foreground/50">
            Built with ❤️ by the Narrate team
          </Caption>
        </div>
      </div>
    </footer>
  );
}



export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
