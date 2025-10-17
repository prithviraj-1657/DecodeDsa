import React, { useEffect, useState } from "react";
import {
  Brain,
  ArrowUpDown,
  Search,
  Database,
  BookOpen,
  Target,
} from "lucide-react";
interface PageLoaderProps {
  isDark?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isDark = false }) => {
  const [activeIcon, setActiveIcon] = useState(0);

  const icons = [
    { Icon: ArrowUpDown, label: "Sorting" },
    { Icon: Search, label: "Searching" },
    { Icon: Target, label: "Arrays" },
    { Icon: Database, label: "Data Structures" },
    { Icon: BookOpen, label: "Operations" },
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 600);

    return () => clearInterval(iconInterval);
  }, [icons.length]);

  const bgClass = isDark
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "bg-gradient-to-br from-slate-50 via-white to-slate-100";

  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`fixed inset-0 ${bgClass} flex items-center justify-center z-[9999] overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-10 ${
              isDark ? "bg-blue-500" : "bg-blue-300"
            }`}
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              animation: `pulse ${3 + i}s ease-in-out infinite`,
              left: `${-50 + i * 30}%`,
              top: `${-30 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className={`w-full h-full`}
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(79, 70, 229, 0.05) 25%, rgba(79, 70, 229, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 70, 229, 0.05) 75%, rgba(79, 70, 229, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(79, 70, 229, 0.05) 25%, rgba(79, 70, 229, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 70, 229, 0.05) 75%, rgba(79, 70, 229, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
            animation: "slide 20s linear infinite",
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto px-6">
        {/* Logo animation */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Brain
              className="w-12 h-12 text-white"
              style={{ animation: "bounce 2s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Main text */}
        <h2 className={`text-3xl font-bold text-center mb-2 ${textClass}`}>
          DecodeDsa
        </h2>
        <p className={`text-center mb-8 ${mutedClass}`}>
          Initializing your learning journey...
        </p>

        {/* Animated icons */}
        <div className="flex justify-center gap-4 mb-10">
          {icons.map((item, index) => {
            const { Icon } = item;
            const isActive = index === activeIcon;
            return (
              <div
                key={index}
                className={`transition-all duration-500 transform ${
                  isActive ? "scale-125" : "scale-100 opacity-40"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    isActive
                      ? isDark
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : isDark
                      ? "bg-slate-700 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip text */}
        <p className={`text-xs text-center ${mutedClass} italic`}>
          Preparing interactive visualizations...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
