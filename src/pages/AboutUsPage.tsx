import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Heart,
  Target,
  Lightbulb,
  Users,
  Rocket,
  Award,
  Code2,
  Brain,
  Zap,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";

export default function AboutUsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const teamValues = [
    {
      icon: Heart,
      title: "Passion for Education",
      description:
        "We believe learning should be accessible, engaging, and visual for everyone.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We constantly explore new ways to make complex algorithms simple and intuitive.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built by learners, for learners. Your feedback shapes our platform.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Quality Content",
      description:
        "Every visualization is carefully crafted to ensure accuracy and clarity.",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "DecodeDSA goes live with 50+ algorithm visualizations",
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Reached 10,000+ active learners across 30+ countries",
    },
    {
      year: "2025",
      title: "Feature Expansion",
      description: "Added advanced topics: Graphs, Trees, and Array Algorithms",
    },
    {
      year: "2025",
      title: "50K+ Learners",
      description: "Growing community with 300+ interactive visualizations",
    },
  ];

  const features = [
    "Interactive step-by-step algorithm visualizations",
    "Real-time code examples with explanations",
    "Time & space complexity analysis",
    "Custom input for hands-on experimentation",
    "Responsive design for all devices",
    "Completely free and open to everyone",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 font-medium">
            <Heart className="w-4 h-4 mr-2" />
            About Our Journey
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Making DSA Learning
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Simple, Visual & Fun
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            DecodeDSA was born from a simple belief: complex algorithms don't
            have to be confusing. Through interactive visualizations, we're
            transforming how students and developers understand Data Structures
            & Algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sorting"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-indigo-700 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <Rocket className="w-5 h-5 mr-2" /> Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#mission"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <Brain className="w-5 h-5 mr-2" /> Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4 font-medium">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-700 mb-6">
                Democratizing Algorithm Education
              </h2>
              <p className="text-gray-600 dark:text-gray-500 text-lg mb-6">
                Our mission is to make Data Structures and Algorithms accessible
                to everyone, regardless of their background or learning style.
                We believe that visual, interactive learning breaks down
                barriers and accelerates understanding.
              </p>
              <p className="text-gray-600 dark:text-gray-500 text-lg">
                By combining cutting-edge web technologies with pedagogical
                best practices, we're creating a platform where learners can
                not just read about algorithms—they can see them, interact with
                them, and truly understand how they work.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-indigo-100 mb-6">
                  To become the world's most trusted and loved platform for
                  learning Data Structures and Algorithms through visual
                  storytelling and interactive experiences.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Empower 1M+ learners globally</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Cover 500+ algorithm visualizations</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Build the largest DSA learning community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at DecodeDSA
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} text-white rounded-2xl mb-4`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey/Timeline Section */}
      <section className="py-1 bg-white pt-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-700 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-500 max-w-2xl mx-auto">
              From a simple idea to a thriving learning platform
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Enhanced Timeline line with gradient and glow - starts from first dot and ends at last dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30" style={{ top: '3rem', height: `calc(100% - 16rem)` }}></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative mb-16 md:mb-20 group ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-16 md:ml-auto" : "md:pl-16"
                    }`}
                  >
                    {/* Enhanced Card with gradient border */}
                    <div className="relative">
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-500"></div>
                      
                      {/* Card content */}
                      <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-transparent group-hover:border-purple-200">
                        {/* Subtle corner gradient accent */}
                        <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10`}></div>
                        
                        {/* Year badge with icon */}
                        <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold mb-4 text-lg shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
                          <Award className="w-5 h-5 mr-2" />
                          {milestone.year}
                        </div>
                        
                        {/* Title with gradient on hover */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 mb-3 transition-all duration-300">
                          {milestone.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {milestone.description}
                        </p>
                        
                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Timeline dot with multi-layer pulse */}
                  <div className="hidden md:block absolute left-1/2 top-12 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                      {/* Outer pulse ring */}
                      <div className="absolute w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-40 animate-ping"></div>
                      
                      {/* Middle glow ring */}
                      <div className="absolute w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-40 group-hover:scale-125 group-hover:opacity-60 transition-all duration-500"></div>
                      
                      {/* Inner dot with icon */}
                      <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full border-4 border-white shadow-xl shadow-purple-500/50 group-hover:shadow-purple-500/80 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white dark:bg-slate-800 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile enhanced indicator */}
                  <div className="md:hidden absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30"></div>
                  <div className="md:hidden absolute left-0 top-12 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-3 border-white shadow-lg shadow-purple-500/50"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full mb-4 font-medium">
                <Award className="w-4 h-4 mr-2" />
                What We Offer
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-black mb-6">
                Everything You Need to Master DSA
              </h2>
              <p className="text-gray-600 dark:text-gray-500 text-lg mb-8">
                DecodeDSA provides comprehensive, interactive learning
                experiences designed to help you understand algorithms deeply
                and intuitively.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-500 text-lg">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  120+
                </div>
                <p className="text-gray-600 dark:text-gray-300">Algorithms</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <p className="text-gray-600 dark:text-gray-300">Learners</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                  300+
                </div>
                <p className="text-gray-600 dark:text-gray-300">Visualizations</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  30+
                </div>
                <p className="text-gray-600 dark:text-gray-300">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative container mx-auto px-6 text-center">
          <Code2 className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of learners who are mastering Data Structures and
            Algorithms through interactive visualizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sorting"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-indigo-700 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <Rocket className="w-5 h-5 mr-2" /> Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/array-algorithms"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <Brain className="w-5 h-5 mr-2" /> Explore Algorithms
            </Link>
          </div>
        </div>
      </section>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-opacity duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  DecodeDsa
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Interactive platform to master Data Structures & Algorithms through visualization. Learn, practice, and excel.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all transform hover:scale-110">
                  <Github className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all transform hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all transform hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/sorting" className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Sorting Algorithms
                  </Link>
                </li>
                <li>
                  <Link to="/searching" className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Searching Algorithms
                  </Link>
                </li>
                <li>
                  <Link to="/array-algorithms" className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Array Algorithms
                  </Link>
                </li>
                <li>
                  <Link to="/data-structures" className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Data Structures
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Features
                  </a>
                </li>
                <li>
                  <button className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    How It Works
                  </button>
                </li>
                <li>
                  <button className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    FAQ
                  </button>
                </li>
                <li>
                  <button className="hover:text-white hover:translate-x-1 inline-flex items-center transition-all group">
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Documentation
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Get in Touch</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">📧</span>
                  </div>
                  <span className="text-gray-400">contact@decodedsa.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">💬</span>
                  </div>
                  <span className="text-gray-400">Join our Discord community</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">📍</span>
                  </div>
                  <span className="text-gray-400">Hyderabad, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} DecodeDsa. All rights reserved. Made with ❤️ for learners worldwide.
              </p>
              <div className="flex gap-6 text-sm">
                <button className="text-gray-500 hover:text-white transition-colors">
                  Privacy Policy
                </button>
                <button className="text-gray-500 hover:text-white transition-colors">
                  Terms of Service
                </button>
                <button className="text-gray-500 hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}