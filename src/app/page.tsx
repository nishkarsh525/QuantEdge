"use client";
import {
  ArrowRight,
  BarChart2,
  Bell,
  Book,
  Globe,
  Menu,
  PieChart,
  Shield,
  TrendingUp,
  X,
  Zap,
  Moon,
  Sun,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const Animatedsection = ({ children }: any) => {
  const ref = useRef(null);
  const isinview = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isinview ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

const FeatureBox = ({ icon, title, description, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
whileHover={{ y: -4 }}
      className="bg-card border rounded-xl p-6 flex flex-col h-full shadow-soft hover:shadow-soft-lg transition-shadow"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground flex-grow">{description}</p>
      <button className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
        Learn more <ArrowRight size={16} className="ml-1" />
      </button>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
className="bg-card border rounded-xl p-6 h-full flex flex-col shadow-soft hover:shadow-soft-lg transition-shadow"
    >
      <p className="text-sm text-muted-foreground italic mb-4">“{quote}”</p>
      <div className="mt-auto flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-semibold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tradingFeatures = [
    {
      icon: <Globe size={28} />,
      title: "Global Markets",
      description:
        "Access a wide range of international markets and trade various assets from a single platform.",
    },
    {
      icon: <Zap size={28} />,
      title: "Real-time Data",
      description:
        "Stay informed with lightning-fast, real-time market data and instant trade execution.",
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Trading",
      description:
        "Trade with confidence using our advanced encryption and multi-factor authentication systems.",
    },
    {
      icon: <PieChart size={28} />,
      title: "Portfolio Analysis",
      description:
        "Gain insights into your portfolio performance with comprehensive analysis tools and reports.",
    },
    {
      icon: <Bell size={28} />,
      title: "Price Alerts",
      description:
        "Never miss a trading opportunity with customizable price alerts and notifications.",
    },
    {
      icon: <Book size={28} />,
      title: "Trading Education",
      description:
        "Enhance your trading skills with our extensive library of educational resources and webinars.",
    },
  ];

  const testimonials = [
    {
      quote: "QuantEdge has revolutionized my trading strategy. The tools are intuitive and powerful, and the real-time data is a game-changer.",
      author: "John Doe",
      role: "Full-time Trader",
    },
    {
      quote: "As a beginner, I was intimidated by trading. QuantEdge's educational resources and user-friendly interface made it easy for me to get started.",
      author: "Jane Smith",
      role: "New Investor",
    },
    {
      quote: "The portfolio analysis tools are top-notch. I can easily track my investments and make informed decisions.",
      author: "Samuel Green",
      role: "Financial Analyst",
    },
  ];

  const [ismenuopen, setismenuopen] = useState(false);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <button
        className="p-2 rounded-md hover:bg-accent"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    );
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight"
        >
          QuantEdge
        </motion.div>
        <nav className="hidden md:block">
          <ul className="flex gap-6 items-center text-sm">
            {["Markets", "Trading", "Analysis", "Learn"].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {renderThemeChanger()}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md border border-transparent"
            onClick={() => router.push("/login")}
          >
            Start Trading
          </motion.button>
        </div>
        <div className="md:hidden flex items-center">
          {renderThemeChanger()}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-3 rounded-md p-2 hover:bg-accent"
            onClick={() => setismenuopen(!ismenuopen)}
            aria-label="Open menu"
          >
            {ismenuopen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </header>
      {ismenuopen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-card/95 backdrop-blur px-4 py-2 border-b"
        >
          <ul className="space-y-3">
            {["Markets", "Trading", "Analysis", "Learn"].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="block text-muted-foreground hover:text-foreground transition-colors py-2">
                  {item}
                </span>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md border border-transparent"
              >
                Start Trading
              </button>
            </motion.li>
          </ul>
        </motion.div>
      )}
      <main className="container mx-auto px-4">
        <Animatedsection>
          <div className="py-20 md:py-24 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            >
              Trade smarter with a minimal, powerful platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Real-time data, secure execution, and clean tools built for focus.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/register")}
                className="bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                Get started
                <ArrowRight size={18} />
              </motion.button>
              <button
                onClick={() => router.push("/demo")}
                className="px-7 py-3 rounded-lg border text-foreground bg-card hover:bg-accent"
              >
                View demo
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Shield size={16} /> Secure</div>
              <div className="flex items-center gap-2"><Zap size={16} /> Fast</div>
              <div className="flex items-center gap-2"><BarChart2 size={16} /> Analytics</div>
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Why Choose QuantEdge?</h2>
              <p className="text-sm md:text-base text-muted-foreground">Professional-grade tools with a focus on clarity and speed.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {tradingFeatures.map((feature, index) => (
                <FeatureBox
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                What Our Users Say
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Thousands of traders trust TradePro to power their financial journey.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Get started in 3 simple steps</h2>
              <p className="text-sm md:text-base text-muted-foreground">It takes less than 5 minutes to be up and running.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[{
                n: 1, t: "Create account", d: "Sign up with your email—no paperwork." },
                { n: 2, t: "Fund", d: "Add money securely with multiple methods." },
                { n: 3, t: "Trade", d: "Start with a demo or go live instantly." }].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-card border rounded-xl p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground/80 font-semibold">
                    {s.n}
                  </div>
                  <h3 className="font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button onClick={() => router.push("/register")} className="px-7 py-3 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-2">
                Create free account <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Animatedsection>

        <Animatedsection>
          <div className="my-16 text-center">
<div className="bg-card border rounded-2xl p-10 shadow-soft-md">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Ready to start trading?</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">Join thousands of traders using a cleaner, faster platform.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => router.push("/register")} className="px-7 py-3 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-2">
                  Create free account <ArrowRight size={18} />
                </button>
                <button onClick={() => router.push("/demo")} className="px-7 py-3 rounded-lg border bg-card">Try demo</button>
              </div>
            </div>
          </div>
        </Animatedsection>
      </main>

      <footer className="bg-card/70 backdrop-blur border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-3 text-foreground">QuantEdge</h3>
              <p className="text-muted-foreground text-sm">Trade Smarter, Not Harder.</p>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Stocks</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Futures & Options</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">IPO</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Mutual Funds</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Social</h3>
              <div className="flex space-x-4 text-muted-foreground">
                {/* <a href="#" className="hover:text-foreground"><Twitter /></a> */}
                <a href="#" className="hover:text-foreground"><Linkedin /></a>
                {/* <a href="#" className="hover:text-foreground"><Instagram /></a> */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} QuantEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
