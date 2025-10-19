"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Code, X } from "lucide-react";
import { Button } from "../../components/ui/button";

interface ArrayElement {
  value: number;
  isHighlighted: boolean;
  isPointer1: boolean;
  isPointer2: boolean;
  isPointer3: boolean;
}

interface Step {
  array: ArrayElement[];
  description: string;
  code: string;
  waterHeight?: number[];
  foundPairs?: [number, number][];
  foundTriplets?: [number, number, number][];
}

type ProblemType =
  | "two-sum"
  | "three-sum"
  | "container-water"
  | "remove-duplicates"
  | "move-zeroes";

interface QuestionInfo {
  id: ProblemType;
  title: string;
  description: string;
}

const QUESTIONS: QuestionInfo[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Find two numbers in the array that add up to the target sum.",
  },
  {
    id: "three-sum",
    title: "Three Sum",
    description:
      "Find three numbers in the array that add up to the target sum.",
  },
];

const QUESTIONS_MODAL: QuestionInfo[] = [
  {
    id: "container-water",
    title: "Container With Most Water",
    description:
      "Find two lines that form a container with the most water. The area is calculated as min(height[i], height[j]) × (j - i).",
  },
  {
    id: "remove-duplicates",
    title: "Remove Duplicates (Sorted)",
    description:
      "Given a sorted array, remove duplicates in-place so each element appears once and return the new length.",
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    description:
      "Move all zeroes to the end of the array while maintaining the relative order of non-zero elements.",
  },
];

function TwoPointerPage() {
  const [selectedProblem, setSelectedProblem] =
    useState<ProblemType>("two-sum");
  const [arrayInput, setArrayInput] = useState<string>("");
  const [target, setTarget] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [showFullCode, setShowFullCode] = useState<boolean>(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState<boolean>(false);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsVisualizing(false);
    setShowFullCode(false);
  };

  const generateTwoSumSteps = (array: number[]) => {
    const sortedArray = [...array].sort((a, b) => a - b);
    const newSteps: Step[] = [];
    const foundPairs: [number, number][] = [];
    let left = 0;
    let right = sortedArray.length - 1;

    newSteps.push({
      array: sortedArray.map((num) => ({
        value: num,
        isHighlighted: false,
        isPointer1: false,
        isPointer2: false,
        isPointer3: false,
      })),
      description: "Initial sorted array",
      code: `# Sort the array
array.sort()`,
      foundPairs: [],
    });

    while (left < right) {
      const currentLeft = left;
      const currentRight = right;
      const currentArray = sortedArray.map((num, i) => ({
        value: num,
        isHighlighted: false,
        isPointer1: i === currentLeft,
        isPointer2: i === currentRight,
        isPointer3: false,
      }));
      newSteps.push({
        array: currentArray,
        description: `Checking ${sortedArray[currentLeft]} + ${
          sortedArray[currentRight]
        } = ${sortedArray[currentLeft] + sortedArray[currentRight]}`,
        code: `# Check sum of elements at left and right pointers
sum = array[left] + array[right]
if sum == target:
  result.append([array[left], array[right]])
  left += 1
  right -= 1
elif sum < target:
  left += 1
else:
    right -= 1`,
        foundPairs: [...foundPairs],
      });

      const sum = sortedArray[left] + sortedArray[right];
      if (sum === target) {
        foundPairs.push([sortedArray[currentLeft], sortedArray[currentRight]]);
        const finalArray = currentArray.map((el, i) => ({
          ...el,
          isHighlighted: i === currentLeft || i === currentRight,
        }));
        newSteps.push({
          array: finalArray,
          description: `Found pair: ${sortedArray[currentLeft]} + ${sortedArray[currentRight]} = ${target}`,
          code: `# Found a target sum pair
result.append([array[left], array[right]])
left += 1
right -= 1`,
          foundPairs: [...foundPairs],
        });
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }

    if (foundPairs.length === 0) {
      newSteps.push({
        array: sortedArray.map((num) => ({
          value: num,
          isHighlighted: false,
          isPointer1: false,
          isPointer2: false,
          isPointer3: false,
        })),
        description: "No pairs found that sum to target",
        code: `# No solution found
return []`,
        foundPairs: [],
      });
    } else {
      newSteps.push({
        array: sortedArray.map((num) => ({
          value: num,
          isHighlighted: false,
          isPointer1: false,
          isPointer2: false,
          isPointer3: false,
        })),
        description: `Search complete! Found ${foundPairs.length} pair(s) that sum to ${target}`,
        code: `# All pairs found
return result`,
        foundPairs: [...foundPairs],
      });
    }

    return newSteps;
  };

  const generateThreeSumSteps = (array: number[]) => {
    const sortedArray = [...array].sort((a, b) => a - b);
    const newSteps: Step[] = [];
    const foundTriplets: [number, number, number][] = [];

    newSteps.push({
      array: sortedArray.map((num) => ({
        value: num,
        isHighlighted: false,
        isPointer1: false,
        isPointer2: false,
        isPointer3: false,
      })),
      description: "Initial sorted array",
      code: `# Sort the array
array.sort()`,
      foundTriplets: [],
    });

    for (let i = 0; i < sortedArray.length - 2; i++) {
      let left = i + 1;
      let right = sortedArray.length - 1;

      while (left < right) {
        const currentI = i;
        const currentLeft = left;
        const currentRight = right;
        const currentArray = sortedArray.map((num, idx) => ({
          value: num,
          isHighlighted: false,
          isPointer1: idx === currentI,
          isPointer2: idx === currentLeft,
          isPointer3: idx === currentRight,
        }));
        newSteps.push({
          array: currentArray,
          description: `Checking ${sortedArray[currentI]} + ${
            sortedArray[currentLeft]
          } + ${sortedArray[currentRight]} = ${
            sortedArray[currentI] +
            sortedArray[currentLeft] +
            sortedArray[currentRight]
          }`,
          code: `# Check sum of three elements
sum = array[i] + array[left] + array[right]
if sum == target:
  result.append([array[i], array[left], array[right]])
  left += 1
  right -= 1
elif sum < target:
  left += 1
else:
    right -= 1`,
          foundTriplets: [...foundTriplets],
        });

        const sum = sortedArray[i] + sortedArray[left] + sortedArray[right];
        if (sum === target) {
          foundTriplets.push([
            sortedArray[currentI],
            sortedArray[currentLeft],
            sortedArray[currentRight],
          ]);
          const finalArray = currentArray.map((el, idx) => ({
            ...el,
            isHighlighted:
              idx === currentI || idx === currentLeft || idx === currentRight,
          }));
          newSteps.push({
            array: finalArray,
            description: `Found triplet: ${sortedArray[currentI]} + ${sortedArray[currentLeft]} + ${sortedArray[currentRight]} = ${target}`,
            code: `# Found a target sum triplet
result.append([array[i], array[left], array[right]])
left += 1
right -= 1`,
            foundTriplets: [...foundTriplets],
          });
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }

    if (foundTriplets.length === 0) {
      newSteps.push({
        array: sortedArray.map((num) => ({
          value: num,
          isHighlighted: false,
          isPointer1: false,
          isPointer2: false,
          isPointer3: false,
        })),
        description: "No triplets found that sum to target",
        code: `# No solution found
return []`,
        foundTriplets: [],
      });
    } else {
      newSteps.push({
        array: sortedArray.map((num) => ({
          value: num,
          isHighlighted: false,
          isPointer1: false,
          isPointer2: false,
          isPointer3: false,
        })),
        description: `Search complete! Found ${foundTriplets.length} triplet(s) that sum to ${target}`,
        code: `# All triplets found
return result`,
        foundTriplets: [...foundTriplets],
      });
    }

    return newSteps;
  };

  const handleVisualize = () => {
    try {
      const numbers = arrayInput
        .split(",")
        .map((num) => Number.parseInt(num.trim()));
      if (numbers.some(isNaN)) {
        throw new Error("Invalid number in array");
      }
      resetVisualization();
      setIsVisualizing(true);

      let newSteps: Step[] = [];
      if (selectedProblem === "two-sum") {
        newSteps = generateTwoSumSteps(numbers);
      } else if (selectedProblem === "three-sum") {
        newSteps = generateThreeSumSteps(numbers);
      }

      setSteps(newSteps);
      setIsVisualizing(false);
    } catch (err) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  const getFullCode = () => {
    if (selectedProblem === "two-sum") {
      return `def two_sum(array, target):
  # Sort the array
  array.sort()
  left, right = 0, len(array) - 1
  result = []
  
  while left < right:
      sum = array[left] + array[right]
      if sum == target:
          result.append([array[left], array[right]])
          left += 1
          right -= 1
      elif sum < target:
          left += 1
      else:
          right -= 1
  
  return result`;
    } else if (selectedProblem === "three-sum") {
      return `def three_sum(array, target):
  # Sort the array
  array.sort()
  result = []
  
  for i in range(len(array) - 2):
      left, right = i + 1, len(array) - 1
      
      while left < right:
          sum = array[i] + array[left] + array[right]
          if sum == target:
              result.append([array[i], array[left], array[right]])
              left += 1
              right -= 1
          elif sum < target:
              left += 1
          else:
              right -= 1
  
  return result`;
    }
    return "";
  };

  const getProblemDescription = () => {
    const question = QUESTIONS.find((q) => q.id === selectedProblem);
    return question?.description || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/array-algorithms"
                className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Two Pointer Techniques
              </h1>
            </div>
            <button
              onClick={() => setShowQuestionsModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Questions
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Selection */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Select Algorithm
          </h2>
          <div className="flex gap-3">
            {QUESTIONS.map((question) => (
              <button
                key={question.id}
                onClick={() => {
                  setSelectedProblem(question.id);
                  resetVisualization();
                  setTarget(0);
                  setArrayInput("");
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedProblem === question.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                {question.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {QUESTIONS.find((q) => q.id === selectedProblem)?.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {getProblemDescription()}
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="array-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Array (comma-separated numbers)
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1, 2, 3, 4, 5"
              />
            </div>
            {(selectedProblem === "two-sum" ||
              selectedProblem === "three-sum") && (
              <div>
                <label
                  htmlFor="target-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Target Sum
                </label>
                <input
                  id="target-input"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target sum"
                />
              </div>
            )}
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Visualize
            </button>
          </div>
        </div>
        
        {steps.length > 0 && (
          <>
            {/* Step Navigation */}
            <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Step {currentStep + 1} of {steps.length}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentStep === 0}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentStep((prev) =>
                        Math.min(steps.length - 1, prev + 1)
                      )
                    }
                    disabled={currentStep === steps.length - 1}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {steps[currentStep].description}
              </p>

              {/* Display Found Pairs/Triplets */}
              {selectedProblem === "two-sum" &&
                steps[currentStep].foundPairs &&
                steps[currentStep].foundPairs!.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Found Pairs ({steps[currentStep].foundPairs!.length}):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {steps[currentStep].foundPairs!.map((pair, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-md font-medium"
                        >
                          [{pair[0]}, {pair[1]}]
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProblem === "three-sum" &&
                steps[currentStep].foundTriplets &&
                steps[currentStep].foundTriplets!.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Found Triplets ({steps[currentStep].foundTriplets!.length}
                      ):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {steps[currentStep].foundTriplets!.map((triplet, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-md font-medium"
                        >
                          [{triplet[0]}, {triplet[1]}, {triplet[2]}]
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <Button onClick={() => setCurrentStep(0)} variant="secondary">
                Reset
              </Button>
            </div>

            {/* Array Visualization */}
            <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Array Visualization
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {steps[currentStep].array.map((element, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${
                      element.isHighlighted
                        ? "bg-green-500 text-white"
                        : element.isPointer1
                        ? "bg-blue-500 text-white"
                        : element.isPointer2
                        ? "bg-purple-500 text-white"
                        : element.isPointer3
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {element.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Code
                </h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  <Code className="w-5 h-5" />
                  {showFullCode ? "Show Step Code" : "Show Full Code"}
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  {showFullCode ? getFullCode() : steps[currentStep].code}
                </code>
              </pre>
            </div>
          </>
        )}

         {/* Practice Questions */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-xl font-bold text-black dark:text-gray-200 mb-3">
            Practice Questions
          </h4>
          <div className="space-y-2"></div>
          <>
            <a
              href="https://leetcode.com/problems/two-sum/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • LeetCode: Two Sum
            </a>
            <a
              href="https://leetcode.com/problems/3sum/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • LeetCode: 3Sum
            </a>
            <a
              href="https://practice.geeksforgeeks.org/problems/find-pair-with-given-sum-in-the-array/0"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • GFG: Find Pair with Given Sum
            </a>
          </>
        </div>
      </main>

      

      {showQuestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Additional Two Pointer Problems
              </h2>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {QUESTIONS_MODAL.map((question) => (
                <button
                  key={question.id}
                  onClick={() => {
                    setSelectedProblem(question.id);
                    resetVisualization();
                    setTarget(0);
                    setArrayInput("");
                    setShowQuestionsModal(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedProblem === question.id
                      ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                      : "border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400"
                  }`}
                >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {question.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {question.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TwoPointerPage;
