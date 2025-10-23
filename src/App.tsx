import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Lenis from "lenis";
import Sidebar from "./components/sidebar";
import PageLoader from "./components/PageLoader";
import { useTheme } from "./contexts/ThemeContext";
import AIAssistantPage from "./pages/AIAssistantPage"
import ScrollToTop from "./components/scrollToTop";

// Lazy load all page components
const Home = lazy(() => import("./page"));
const Placeholder = lazy(() => import("./placeholder"));
const SortingAlgorithmsPage = lazy(
  () => import("./pages/SortingAlgorithmsPage")
);
const SearchingAlgorithmsPage = lazy(
  () => import("./pages/SearchingAlgorithmsPage")
);
const StackVisualizerPage = lazy(() => import("./pages/StackVisualizerPage"));
const QueueVisualizerPage = lazy(() => import("./pages/QueueVisualizerPage"));
const TrieVisualizerPage = lazy(() => import("./pages/TrieVisualizerPage")); // ✅ Added
const DequeVisualizerPage = lazy(() => import("./pages/DequeVisualizerPage")); // ✅ Added
const ArrayAlgorithmsPage = lazy(() => import("./pages/array-algorithms"));
const TwoPointerPage = lazy(
  () => import("./pages/array-algorithms/two-pointer")
);
const PrefixSumPage = lazy(() => import("./pages/array-algorithms/prefix-sum"));
const KadanesPage = lazy(() => import("./pages/array-algorithms/kadanes"));
const SlidingWindowPage = lazy(
  () => import("./pages/array-algorithms/sliding-window")
);
const LinkedListVisualizerPage = lazy(
  () => import("./pages/LinkedListVisualizerPage")
);
const HashingPage = lazy(() => import("./pages/array-algorithms/hashing"));
const MonotonicStackPage = lazy(
  () => import("./pages/array-algorithms/monotonic-stack")
);
const SievePage = lazy(() => import("./pages/array-algorithms/sieve"));
const BitManipulationPage = lazy(
  () => import("./pages/array-algorithms/bit-manipulation")
);
const TwoDArraysPage = lazy(() => import("./pages/array-algorithms/2d-arrays"));
const TreeVisualizerPage = lazy(() => import("./pages/TreeVisualizerPage"));
const ExpressionConverterPage = lazy(
  () => import("./pages/ExpressionConverterPage")
);
const GraphVisualizerPage = lazy(() => import("./pages/GraphVisualizerPages"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Loading fallback component
const LoadingFallback = ({ isDark }: { isDark: boolean }) => (
  <PageLoader isDark={isDark} />
);

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // initial load time
    const loader = document.getElementById("initial-loader");
    if (loader) {
      loader.style.display = "none";
    }
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

const [lenis, setLenis] = useState<Lenis | null>(null);

useEffect(() => {
  const lenisInstance = new Lenis({
    duration: 2.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.7,
    prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
  });

  setLenis(lenisInstance);

  let rafId = 0;
  function raf(time: number) {
    lenisInstance.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    if (typeof lenisInstance.destroy === "function") lenisInstance.destroy();
  };
}, []);

  return (
    <>
      {isInitialLoad && <PageLoader isDark={theme === "dark"} />}

      <div className="flex min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className={`flex-1 dark:text-white ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
          {lenis && <ScrollToTop lenis={lenis} />}  
          <Suspense fallback={<LoadingFallback isDark={theme === "dark"} />}>
            <Routes>
              <Route path="/sorting" element={<SortingAlgorithmsPage />} />
              <Route path="/searching" element={<SearchingAlgorithmsPage />} />

              {/* Data Structures */}
              <Route path="/data-structures/stack" element={<StackVisualizerPage />} />
              <Route path="/data-structures/queue" element={<QueueVisualizerPage />} />
              <Route path="/data-structures/trie" element={<TrieVisualizerPage />} /> {/* ✅ Added */}
              <Route path="/data-structures/linked-list" element={<LinkedListVisualizerPage />} />
              <Route path="/data-structures/graph" element={<GraphVisualizerPage />} />
              <Route path="/data-structures/binary-tree" element={<TreeVisualizerPage />} />
              <Route path="/data-structures/deque" element={<DequeVisualizerPage />} />


              {/* Array Algorithms */}
              <Route path="/array-algorithms" element={<ArrayAlgorithmsPage />} />
              <Route path="/array-algorithms/two-pointer" element={<TwoPointerPage />} />
              <Route path="/array-algorithms/prefix-sum" element={<PrefixSumPage />} />
              <Route path="/array-algorithms/kadanes" element={<KadanesPage />} />
              <Route path="/array-algorithms/sliding-window" element={<SlidingWindowPage />} />
              <Route path="/array-algorithms/hashing" element={<HashingPage />} />
              <Route path="/array-algorithms/monotonic-stack" element={<MonotonicStackPage />} />
              <Route path="/array-algorithms/sieve" element={<SievePage />} />
              <Route path="/array-algorithms/bit-manipulation" element={<BitManipulationPage />} />
              <Route path="/array-algorithms/2d-arrays" element={<TwoDArraysPage />} />

              {/* Operations */}
              <Route path="/operations/expression-converter" element={<ExpressionConverterPage />} />

              {/* Other pages */}
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Placeholder />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
