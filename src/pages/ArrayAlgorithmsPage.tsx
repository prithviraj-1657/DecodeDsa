"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Calculator, 
  Hash, 
  TrendingUp, 
  Binary, 
  Layers,
  Grid,
  ArrowRight,
  HelpCircle
} from "lucide-react"
import { QuestionsDialog, QuestionInfo } from "../components/ui/QuestionsDialog"

const QUESTIONS: QuestionInfo[] = [
  {
    id: "two-pointer-1",
    title: "Two Sum Problem",
    description: "Find two numbers in an array that add up to a specific target value.",
  },
  {
    id: "prefix-sum-1",
    title: "Range Sum Query",
    description: "Compute the sum of elements between indices i and j (i ≤ j).",
  },
  {
    id: "kadanes-1",
    title: "Maximum Subarray Sum",
    description: "Find the contiguous subarray with the largest sum.",
  },
]

const QUESTIONS_MODAL: QuestionInfo[] = [
  {
    id: "sliding-window-1",
    title: "Maximum Sum Subarray of Size K",
    description: "Find the maximum sum of any contiguous subarray of size k.",
    comingSoon: true,
  },
  {
    id: "hashing-1",
    title: "Count Pairs with Given Sum",
    description: "Count the number of pairs with a given sum in an array.",
    comingSoon: true,
  },
  {
    id: "monotonic-stack-1",
    title: "Next Greater Element",
    description: "Find the next greater element for each element in an array.",
    comingSoon: true,
  },
  {
    id: "bit-manipulation-1",
    title: "Find the Single Number",
    description: "Find the number that appears only once in an array where every other number appears twice.",
    comingSoon: true,
  },
  {
    id: "2d-arrays-1",
    title: "Spiral Matrix Traversal",
    description: "Print elements of a matrix in spiral order.",
    comingSoon: true,
  },
]

interface Algorithm {
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  path: string
  icon: any
  color: string
}

const algorithms: Algorithm[] = [
  {
    name: "Two Pointer Techniques",
    description: "Visualize two pointer sum, three pointer sum, and other two pointer problems.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/two-pointer",
    icon: ArrowRight,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Prefix Sum & Difference Array",
    description: "Learn about prefix sums, difference arrays, and their applications.",
    timeComplexity: "O(n) preprocessing, O(1) query",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/prefix-sum",
    icon: Calculator,
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Kadane's Algorithm",
    description: "Visualize maximum subarray sum and related problems.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/kadanes",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Sliding Window",
    description: "Learn about fixed and variable size sliding window techniques.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/sliding-window",
    icon: Grid,
    color: "from-orange-500 to-yellow-500"
  },
  {
    name: "Hashing & Frequency Count",
    description: "Use hash maps to solve array problems efficiently.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/hashing",
    icon: Hash,
    color: "from-red-500 to-pink-500"
  },
  {
    name: "Monotonic Stack",
    description: "Visualize next greater/smaller element and related problems.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    path: "/array-algorithms/monotonic-stack",
    icon: Layers,
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "Bit Manipulation",
    description: "Learn about bit operations and XOR techniques.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    path: "/array-algorithms/bit-manipulation",
    icon: Binary,
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Two-Dimensional Arrays",
    description: "Visualize matrix operations and spiral traversals.",
    timeComplexity: "Varies",
    spaceComplexity: "Varies",
    path: "/array-algorithms/2d-arrays",
    icon: Grid,
    color: "from-teal-500 to-cyan-500"
  }
]

function ArrayAlgorithmsPage() {
  const [arrayInput, setArrayInput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [showQuestionsModal, setShowQuestionsModal] = useState<boolean>(false)

  const handleArraySubmit = () => {
    try {
      const numbers = arrayInput.split(',').map(num => parseInt(num.trim()))
      if (numbers.some(isNaN)) {
        throw new Error("Invalid number in array")
      }
      // Store the array in localStorage for other pages to use
      localStorage.setItem('currentArray', JSON.stringify(numbers))
      setError("")
    } catch (err) {
      setError("Please enter valid numbers separated by commas")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Array Algorithms
              </h1>
            </div>
            <button
              onClick={() => setShowQuestionsModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Questions</span>
            </button>
          </div>
          <p className="mt-2 text-gray-600">Visualize array algorithms step by step</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Array Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Enter Your Array</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                Numbers (comma-separated)
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1, 2, 3, 4, 5"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <button
              onClick={handleArraySubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Set Array
            </button>
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm) => (
            <Link
              key={algorithm.name}
              to={algorithm.path}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2">
                {/* Algorithm Header */}
                <div className={`h-32 bg-gradient-to-r ${algorithm.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <algorithm.icon className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Algorithm Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
                  <div className="text-sm text-gray-500">
                    <div>Time Complexity: {algorithm.timeComplexity}</div>
                    <div>Space Complexity: {algorithm.spaceComplexity}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      {showQuestionsModal && (
        <QuestionsDialog
          title="Array Algorithm Problems"
          questions={[...QUESTIONS, ...QUESTIONS_MODAL]}
          onQuestionSelect={(question) => {
            setShowQuestionsModal(false);
            // Set array input based on selected question
            if (question.id.includes("two-pointer")) {
              setArrayInput("2, 7, 11, 15");
            } else if (question.id.includes("prefix-sum")) {
              setArrayInput("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");
            } else if (question.id.includes("kadanes")) {
              setArrayInput("-2, 1, -3, 4, -1, 2, 1, -5, 4");
            } else {
              setArrayInput("1, 2, 3, 4, 5");
            }
          }}
          onClose={() => setShowQuestionsModal(false)}
        />
      )}
    </div>
  )
}

export default ArrayAlgorithmsPage
