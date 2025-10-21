import React from 'react';
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

// Define the navigation items and their corresponding section IDs
const navItems = [
  // Link to the top/Hero section
  { name: 'Home', id: 'top' }, 
  // Map 'Why Choose Our Platform?' section
  { name: 'Why Choose Us', id: 'features' },
  // Map 'How It Works' section
  { name: 'How It Works', id: 'how-it-works' },
  // Map 'Explore Categories' section
  { name: 'Categories', id: 'categories' },
  // Map 'FAQ' section
  { name: 'FAQ', id: 'faq' },
];

const Navbar: React.FC = () => {
  // Smooth scroll function using native browser API
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    // The top link should scroll to the very top of the window
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Scroll to the specified section ID
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // Make the navbar fixed/sticky, white/light, and place it above all content (z-50)
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md p-4 transition-all duration-300 ease-in-out dark:bg-slate-900/90 dark:shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo/Site Name - Use a Link for routing */}
        <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          DecodeDSA
        </Link>
        
        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`} // Standard href for fallback/accessibility
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition duration-300 text-sm uppercase tracking-wider"
              onClick={(e) => handleScroll(e, item.id)}
            >
              {item.name}
            </a>
          ))}

          {/* Call to Action Button */}
           <Link
             to="/about"
             className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white transition-all transform bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:-translate-y-0.5"
           >
             Get Started
           </Link>
        </div>
        
        {/* Mobile Menu Button (you can implement a drawer later, for now, just the icon) */}
        <div className="md:hidden">
            <button aria-label="Toggle navigation" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;