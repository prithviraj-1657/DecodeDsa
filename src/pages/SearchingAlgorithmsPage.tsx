import React, { useState } from 'react';
import { Search, Clock, Code2, GitCompare, Eye } from 'lucide-react';
import SearchingVisualizer from '../components/SearchingVisualizer';
import ParallelSearchingVisualizer from '../components/ParallelSearchingVisualizer';
import { getAvailableAlgorithms } from '../utils/searchingAlgorithms';
import type { SearchingAlgorithm } from '../types/algorithms';
import { QuestionsDialog, QuestionInfo } from '../components/ui/QuestionsDialog';

// Define questions for searching algorithms
const QUESTIONS: QuestionInfo[] = [
  {
    id: "linear-search",
    title: "Linear Search",
    description: "Find an element in an array by checking each element sequentially.",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Find an element in a sorted array by repeatedly dividing the search interval in half.",
  },
];

const QUESTIONS_MODAL: QuestionInfo[] = [
  {
    id: "jump-search",
    title: "Jump Search",
    description: "Find an element by jumping ahead by fixed steps and then performing a linear search.",
    comingSoon: true,
  },
  {
    id: "interpolation-search",
    title: "Interpolation Search",
    description: "An improved variant of binary search for uniformly distributed sorted arrays.",
    comingSoon: true,
  },
  {
    id: "exponential-search",
    title: "Exponential Search",
    description: "Find a range where element is present, then do binary search in that range.",
    comingSoon: true,
  },
];

function SearchingAlgorithmsPage() {
  const searchingAlgorithms = getAvailableAlgorithms();
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchingAlgorithm | null>(null);
  const [selectedAlgorithm2, setSelectedAlgorithm2] = useState<SearchingAlgorithm | null>(null);
  const [inputArray, setInputArray] = useState<string>('');
  const [targetValue, setTargetValue] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState<boolean>(false);

  const handleAlgorithmSelect = (algorithm: SearchingAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setShowVisualization(false);
    // Set default values based on algorithm
    if (algorithm.name === "Binary Search") {
      setInputArray("1 3 5 7 9 11 13 15 17 19");
      setTargetValue("7");
    } else {
      setInputArray("64 34 25 12 22 11 90 88");
      setTargetValue("22");
    }
  };

   const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputArray.trim() && targetValue.trim()) {
      // In comparison mode, both must be selected
      if (comparisonMode) {
        if (selectedAlgorithm && selectedAlgorithm2) {
          setShowVisualization(true);
        } else {
          alert('Please select two algorithms to compare.');
        }
      } else {
        setShowVisualization(true);
      }
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto py-4 px-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3 min-h-[110px]">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Searching Algorithms Visualizer
                </h1>
                <p className="text-sm md:text-base md:mt-2 text-gray-600 dark:text-gray-300">
                  {comparisonMode ? "Compare Linear Search vs. Binary Search" : "Explore how different searching algorithms find elements in arrays"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowQuestionsModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Questions
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setComparisonMode(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  !comparisonMode ? "bg-white dark:bg-slate-600 shadow-sm text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <Eye className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm font-medium">Single View</span>
              </button>
              <button
                onClick={() => setComparisonMode(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  comparisonMode ? "bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <GitCompare className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm font-medium">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {searchingAlgorithms.map((algorithm) => (
            <div
              key={algorithm.name}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-1 ${
                  comparisonMode
                    ? selectedAlgorithm?.name === algorithm.name
                      ? "border-green-500 ring-2 ring-green-200 dark:ring-green-800" 
                      : selectedAlgorithm2?.name === algorithm.name
                      ? "border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800" 
                      : "border-gray-200 hover:border-green-300"
                    : selectedAlgorithm?.name === algorithm.name
                    ? "border-green-500 ring-2 ring-green-200" 
                    : "border-gray-200 hover:border-green-300"
                }`}
              onClick={() =>{
                if(comparisonMode){
                  if(!selectedAlgorithm){
                    setSelectedAlgorithm(algorithm)
                  }
                  else if(!selectedAlgorithm2 &&  algorithm.name !== selectedAlgorithm.name)
                    setSelectedAlgorithm2(algorithm)
                  else if(selectedAlgorithm.name === algorithm.name)
                    setSelectedAlgorithm(null);
                  else if(selectedAlgorithm2?.name === algorithm.name)
                    setSelectedAlgorithm2(null);
                  else
                    setSelectedAlgorithm2(algorithm);
                }
                else
                  handleAlgorithmSelect(algorithm);
              } }
            >
            <div className = "p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{algorithm.name}</h3>
              <div className="flex items-center space-x-2">
                {/* Badge for Algorithm 1 */}
                {comparisonMode && selectedAlgorithm?.name === algorithm.name && (
                  <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                    Algorithm 1
                  </div>
                )}
                {/* Badge for Algorithm 2 */}
                {comparisonMode && selectedAlgorithm2?.name === algorithm.name && (
                  <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">
                    Algorithm 2
                  </div>
                )}
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg">
                  <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{algorithm.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time Complexity
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {algorithm.timeComplexity}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Space Complexity
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {algorithm.spaceComplexity}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Best Case:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      {algorithm.bestCase}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-red-700">
                      Worst Case:
                    </span>
                    <span className="text-gray-600 ml-2">
                      {algorithm.worstCase}
                    </span>
                  </div>
                </div>

                {/* Practice Questions Section */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Practice Questions
                  </h4>
                  <div className="space-y-2">
                    {algorithm.name === "Linear Search" && (
                      <>
                        <a href="https://leetcode.com/problems/linear-search/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Linear Search (Discuss)</a>
                        <a href="https://practice.geeksforgeeks.org/problems/searching-a-number0324/1" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• GFG: Searching a Number</a>
                        <a href="https://leetcode.com/problems/find-numbers-with-even-number-of-digits/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Find Numbers with Even Number of Digits</a>
                      </>
                    )}
                    {algorithm.name === "Binary Search" && (
                      <>
                        <a href="https://leetcode.com/problems/binary-search/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Binary Search</a>
                        <a href="https://leetcode.com/problems/search-in-rotated-sorted-array/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Search in Rotated Sorted Array</a>
                        <a href="https://practice.geeksforgeeks.org/problems/binary-search-1587115620/1" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• GFG: Binary Search</a>
                      </>
                    )}
                    {algorithm.name === "Jump Search" && (
                      <>
                        <a href="https://www.geeksforgeeks.org/jump-search/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• GFG: Jump Search Tutorial</a>
                        <a href="https://leetcode.com/problems/search-insert-position/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Search Insert Position</a>
                      </>
                    )}
                    {algorithm.name === "Exponential Search" && (
                      <>
                        <a href="https://www.geeksforgeeks.org/exponential-search/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• GFG: Exponential Search Tutorial</a>
                        <a href="https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Search in Rotated Sorted Array II</a>
                      </>
                    )}
                    {algorithm.name === "Ternary Search" && (
                      <>
                        <a href="https://www.geeksforgeeks.org/ternary-search/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• GFG: Ternary Search Tutorial</a>
                        <a href="https://leetcode.com/problems/peak-index-in-a-mountain-array/" target="_blank" rel="noopener noreferrer"
                           className="block text-sm text-green-600 dark:text-green-400 hover:underline">• LeetCode: Peak Index in a Mountain Array</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              </div>
          ))}
        </div>

        {selectedAlgorithm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                 {comparisonMode ? "Compare Searching Algorithms" : `Visualize ${selectedAlgorithm.name}`}
              </h3>

              {selectedAlgorithm.name === "Binary Search" && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Binary Search requires a sorted
                    array. The array will be automatically sorted if needed.
                  </p>
                </div>
              )}

              <form onSubmit={handleInputSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="array-input"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Array Elements
                    </label>
                    <input
                      id="array-input"
                      type="text"
                      value={inputArray}
                      onChange={(e) => setInputArray(e.target.value)}
                      placeholder="Enter array (e.g., 64 34 25 12 22 11 90)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="target-input"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Target Value
                    </label>
                    <input
                      id="target-input"
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="Enter target value"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  💡 <strong>Tip:</strong> For arrays with 100+ elements, zoom and pan controls will be automatically enabled for better visualization.
                </p>
                
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Search className="w-5 h-5 mr-2" />
                   {comparisonMode ? "Start Comparison" : "Start Search Visualization"}
                </button>
              </form>

              {showVisualization && (
                <div className="mt-8 border-t pt-8">
                  {comparisonMode && selectedAlgorithm2 ? (
                    // ---> THIS IS WHERE IT IS CALLED <---
                    <ParallelSearchingVisualizer
                      inputArray={inputArray}
                      targetValue={parseInt(targetValue)}
                    />
                  ) : !comparisonMode && selectedAlgorithm ? (
                    <SearchingVisualizer
                      algorithm={selectedAlgorithm}
                      inputArray={inputArray}
                      targetValue={parseInt(targetValue)}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Questions Modal */}
      {showQuestionsModal && (
        <QuestionsDialog
          title="Searching Algorithm Problems"
          questions={[...QUESTIONS, ...QUESTIONS_MODAL]}
          onQuestionSelect={(question) => {
            const algorithm = searchingAlgorithms.find(
              (algo) => algo.name.toLowerCase().includes(question.id.split('-')[0])
            );
            if (algorithm) {
              setSelectedAlgorithm(algorithm);
              setShowQuestionsModal(false);
              setShowVisualization(false);
              if (algorithm.name === "Binary Search") {
                setInputArray("1 3 5 7 9 11 13 15 17 19");
                setTargetValue("7");
              } else {
                setInputArray("64 34 25 12 22 11 90 88");
                setTargetValue("22");
              }
            }
          }}
          onClose={() => setShowQuestionsModal(false)}
          selectedQuestionId={selectedAlgorithm?.name.toLowerCase().includes("linear") ? "linear-search" : 
                             selectedAlgorithm?.name.toLowerCase().includes("binary") ? "binary-search" : undefined}
        />
      )}
    </div>
  );
}

export default SearchingAlgorithmsPage;

