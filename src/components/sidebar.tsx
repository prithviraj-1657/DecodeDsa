import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ArrowUpDown,
  Search,
  Target,
  Database,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Brain,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SubItem {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  icon: any;
  path?: string;
  subItems?: SubItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems: NavItem[] = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "Sorting Algorithms",
      icon: ArrowUpDown,
      path: "/sorting",
    },
    {
      name: "Searching Algorithms",
      icon: Search,
      path: "/searching",
    },
    {
      name: "Array Algorithms",
      icon: Target,
      subItems: [
        { name: "Overview", path: "/array-algorithms" },
        { name: "Two Pointer", path: "/array-algorithms/two-pointer" },
        { name: "Prefix Sum", path: "/array-algorithms/prefix-sum" },
        { name: "Kadane's Algorithm", path: "/array-algorithms/kadanes" },
        { name: "Sliding Window", path: "/array-algorithms/sliding-window" },
        { name: "Hashing", path: "/array-algorithms/hashing" },
        { name: "Monotonic Stack", path: "/array-algorithms/monotonic-stack" },
        { name: "Bit Manipulation", path: "/array-algorithms/bit-manipulation" },
        { name: "2D Arrays", path: "/array-algorithms/2d-arrays" },
        { name: "Sieve of Eratosthenes", path: "/array-algorithms/sieve" },
      ],
    },
    {
      name: "Data Structures",
      icon: Database,
      subItems: [
        { name: "Linked List", path: "/data-structures/linked-list" },
        { name: "Binary Tree", path: "/data-structures/binary-tree" },
        { name: "Stack", path: "/data-structures/stack" },
        { name: "Queue", path: "/data-structures/queue" },
        { name: "Trie", path: "/data-structures/trie" },   // ✅ Added
        { name: "Graph", path: "/data-structures/graph" },
      ],
    },
    {
      name: "Operations",
      icon: BookOpen,
      subItems: [
        {
          name: "Expression Converter",
          path: "/operations/expression-converter",
        },
      ],
    },
  ];

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (subItems?: SubItem[]) => {
    if (!subItems) return false;
    return subItems.some((item) => location.pathname === item.path);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={onToggle}
        className="fixed z-50 p-3 text-white transition-all shadow-lg top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        data-lenis-prevent
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-white shadow-2xl z-40 transition-all duration-300 flex flex-col overflow-y-auto overflow-x-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 p-6 border-b border-slate-300 dark:border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={onToggle}
          >
            <div className="flex items-center justify-center w-10 h-10 transition-transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-110">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text">
                DecodeDsa
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Master Algorithms</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isParentActive(item.subItems)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {expandedSections.includes(item.name) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes(item.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="pl-4 mt-2 ml-4 border-l-2 border-slate-300 dark:border-slate-700 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={onToggle}
                            className={`block px-4 py-2 rounded-lg text-sm transition-all ${isActive(subItem.path)
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50"
                              }`}
                          >
                            {subItem.name}
                          </Link>
                      ))}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.path || "/"}
                  onClick={onToggle}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-300 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-slate-700 dark:text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-slate-400 dark:bg-blue-600"
              aria-label="Toggle theme"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <Moon className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          </div>

          <div className="p-4 border bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm border-blue-500/20">
            <p className="mb-2 text-xs text-slate-700 dark:text-slate-300">
              Interactive DSA Learning
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Visualize, Learn, Master
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
