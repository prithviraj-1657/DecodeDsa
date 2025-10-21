"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Calculator, Hash, TrendingUp, Binary, Layers, Grid, ArrowRight, Target } from "lucide-react"

interface Algorithm {
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  path: string
  icon: any
  color: string
  difficulty: "Easy" | "Medium" | "Hard"
}

const algorithms: Algorithm[] = [
  {
    name: "Two Pointer Techniques",
    description: "Visualize two pointer sum, three pointer sum, and other two pointer problems.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/two-pointer",
    icon: ArrowRight,
    color: "from-blue-500 to-cyan-500",
    difficulty: "Medium",
  },
  {
    name: "Prefix Sum & Range Queries",
    description: "Learn about prefix sums, difference arrays, and their applications.",
    timeComplexity: "O(n) preprocessing, O(1) query",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/prefix-sum",
    icon: Calculator,
    color: "from-green-500 to-emerald-500",
    difficulty: "Easy",
  },
  {
    name: "Kadane's Algorithm",
    description: "Visualize maximum subarray sum and related problems.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/kadanes",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    difficulty: "Medium",
  },
  {
    name: "Sliding Window",
    description: "Learn about fixed and variable size sliding window techniques.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/sliding-window",
    icon: Grid,
    color: "from-orange-500 to-yellow-500",
    difficulty: "Medium",
  },
  {
    name: "Hashing & Frequency Count",
    description: "Use hash maps to solve array problems efficiently.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/hashing",
    icon: Hash,
    color: "from-red-500 to-pink-500",
    difficulty: "Easy",
  },
  {
    name: "Monotonic Stack",
    description: "Visualize next greater/smaller element and related problems.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/monotonic-stack",
    icon: Layers,
    color: "from-indigo-500 to-purple-500",
    difficulty: "Hard",
  },
  {
    name: "Bit Manipulation",
    description: "Learn about bit operations and XOR techniques.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/bit-manipulation",
    icon: Binary,
    color: "from-yellow-500 to-orange-500",
    difficulty: "Medium",
  },
  {
    name: "2D Arrays & Matrices",
    description: "Visualize matrix operations and spiral traversals.",
    timeComplexity: "Varies",
    spaceComplexity: "Varies",
    path: "/array-algorithms/2d-arrays",
    icon: Grid,
    color: "from-teal-500 to-cyan-500",
    difficulty: "Medium",
  },
  {
    name: "Sieve of Eratosthenes",
    description: "Find all prime numbers up to a specified integer using an ancient, efficient method.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/sieve",
    icon: Target,
    color: "from-yellow-500 to-orange-500",
    difficulty: "Medium",
  },
]

function ArrayAlgorithmsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")

  const filteredAlgorithms =
    selectedDifficulty === "All" ? algorithms : algorithms.filter((algo) => algo.difficulty === selectedDifficulty)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 dark:bg-slate-700 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Array Algorithms
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">Master essential array algorithms with interactive visualizations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Difficulty Filter */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filter by Difficulty</h2>
          <div className="flex flex-wrap gap-3">
            {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3.5 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-700 dark:bg-slate-700 text-gray-700 dark:text-gray-300 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algorithm) => (
            <Link key={algorithm.name} to={algorithm.path} className="group">
              <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:border-slate-700 dark:hover:border-slate-600 transform hover:-translate-y-2">
                {/* Algorithm Header */}
                <div className={`h-32 bg-gradient-to-r ${algorithm.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <algorithm.icon className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(algorithm.difficulty)}`}
                    >
                      {algorithm.difficulty}
                    </span>
                  </div>
                </div>

                {/* Algorithm Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {algorithm.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300 text-sm mb-4 leading-relaxed">{algorithm.description}</p>

                  {/* Complexity Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Time:</span>
                      <span className="font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                        {algorithm.timeComplexity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Space:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {algorithm.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Arrow */}
                  <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-sm font-medium">Explore Algorithm</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Path Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recommended Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Beginner Path</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Hashing & Frequency Count
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Prefix Sum & Range Queries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Two Pointer Techniques
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Advanced Path</h3>
              <ol className="space-y-2 text-sm text-purple-800">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Sliding Window
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Kadane's Algorithm
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Monotonic Stack
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ArrayAlgorithmsPage


