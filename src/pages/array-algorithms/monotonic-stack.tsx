"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import { Button } from "../../components/ui/button";

interface ArrayElement {
  value: number;
  isHighlighted: boolean;
  isProcessed: boolean;
  hasResult: boolean;
  result?: number;
}

interface StackElement {
  value: number;
  index: number;
  isActive: boolean;
}

interface Step {
  array: ArrayElement[];
  stack: StackElement[];
  description: string;
  code: string;
  currentIndex: number;
}

function MonotonicStackPage() {
  const [arrayInput, setArrayInput] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "next-greater" | "next-smaller" | "daily-temps" | "largest-rect"
  >("next-greater");
  const [showFullCode, setShowFullCode] = useState<boolean>(false);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsVisualizing(false);
    setShowFullCode(false);
  };

  const generateNextGreaterSteps = (array: number[]) => {
    const newSteps: Step[] = [];
    const stack: number[] = [];
    const result = new Array(array.length).fill(-1);

    // Initial state
    newSteps.push({
      array: array.map((num) => ({
        value: num,
        isHighlighted: false,
        isProcessed: false,
        hasResult: false,
      })),
      stack: [],
      description: "Initialize empty stack and result array",
      code: `# Initialize stack and result
stack = []
result = [-1] * len(array)`,
      currentIndex: -1,
    });

    // Process each element
    for (let i = 0; i < array.length; i++) {
      // Pop elements smaller than current
      while (stack.length > 0 && array[stack[stack.length - 1]] < array[i]) {
        const index = stack.pop()!;
        result[index] = array[i];
      }

      // Add current step showing popping
      if (stack.length > 0 || i > 0) {
        const currentArray = array.map((num, idx) => ({
          value: num,
          isHighlighted: idx === i,
          isProcessed: idx < i,
          hasResult: result[idx] !== -1,
          result: result[idx] !== -1 ? result[idx] : undefined,
        }));

        const currentStack = stack.map((stackIdx, pos) => ({
          value: array[stackIdx],
          index: stackIdx,
          isActive: pos === stack.length - 1,
        }));

        newSteps.push({
          array: currentArray,
          stack: currentStack,
          description: `Processing element ${array[i]} at index ${i}`,
          code: `# Pop smaller elements and set their next greater
while stack and array[stack[-1]] < array[i]:
    index = stack.pop()
    result[index] = array[i]`,
          currentIndex: i,
        });
      }

      // Push current index to stack
      stack.push(i);

      const currentArray = array.map((num, idx) => ({
        value: num,
        isHighlighted: idx === i,
        isProcessed: idx <= i,
        hasResult: result[idx] !== -1,
        result: result[idx] !== -1 ? result[idx] : undefined,
      }));

      const currentStack = stack.map((stackIdx, pos) => ({
        value: array[stackIdx],
        index: stackIdx,
        isActive: stackIdx === i,
      }));

      newSteps.push({
        array: currentArray,
        stack: currentStack,
        description: `Push index ${i} to stack`,
        code: `# Push current index to stack
stack.append(i)`,
        currentIndex: i,
      });
    }

    // Final state
    newSteps.push({
      array: array.map((num, idx) => ({
        value: num,
        isHighlighted: false,
        isProcessed: true,
        hasResult: true,
        result: result[idx] !== -1 ? result[idx] : -1,
      })),
      stack: [],
      description: `Next greater elements: [${result.join(", ")}]`,
      code: `# Return result
return result`,
      currentIndex: -1,
    });

    return newSteps;
  };

  const generateNextSmallerSteps = (array: number[]) => {
    const newSteps: Step[] = [];
    const stack: number[] = [];
    const result = new Array(array.length).fill(-1);

    newSteps.push({
      array: array.map((num) => ({
        value: num,
        isHighlighted: false,
        isProcessed: false,
        hasResult: false,
      })),
      stack: [],
      description: "Initialize empty stack and result array",
      code: `# Initialize stack and result
stack = []
result = [-1] * len(array)`,
      currentIndex: -1,
    });

    for (let i = 0; i < array.length; i++) {
      while (stack.length > 0 && array[stack[stack.length - 1]] > array[i]) {
        const index = stack.pop()!;
        result[index] = array[i];
      }

      if (stack.length > 0 || i > 0) {
        const currentArray = array.map((num, idx) => ({
          value: num,
          isHighlighted: idx === i,
          isProcessed: idx < i,
          hasResult: result[idx] !== -1,
          result: result[idx] !== -1 ? result[idx] : undefined,
        }));

        const currentStack = stack.map((stackIdx, pos) => ({
          value: array[stackIdx],
          index: stackIdx,
          isActive: pos === stack.length - 1,
        }));

        newSteps.push({
          array: currentArray,
          stack: currentStack,
          description: `Processing element ${array[i]} at index ${i}`,
          code: `# Pop greater elements and set their next smaller
while stack and array[stack[-1]] > array[i]:
    index = stack.pop()
    result[index] = array[i]`,
          currentIndex: i,
        });
      }

      stack.push(i);

      const currentArray = array.map((num, idx) => ({
        value: num,
        isHighlighted: idx === i,
        isProcessed: idx <= i,
        hasResult: result[idx] !== -1,
        result: result[idx] !== -1 ? result[idx] : undefined,
      }));

      const currentStack = stack.map((stackIdx, pos) => ({
        value: array[stackIdx],
        index: stackIdx,
        isActive: stackIdx === i,
      }));

      newSteps.push({
        array: currentArray,
        stack: currentStack,
        description: `Push index ${i} to stack`,
        code: `# Push current index to stack
stack.append(i)`,
        currentIndex: i,
      });
    }

    newSteps.push({
      array: array.map((num, idx) => ({
        value: num,
        isHighlighted: false,
        isProcessed: true,
        hasResult: true,
        result: result[idx] !== -1 ? result[idx] : -1,
      })),
      stack: [],
      description: `Next smaller elements: [${result.join(", ")}]`,
      code: `# Return result
return result`,
      currentIndex: -1,
    });

    return newSteps;
  };

  const generateDailyTempsSteps = (array: number[]) => {
    const newSteps: Step[] = [];
    const stack: number[] = [];
    const result = new Array(array.length).fill(0);

    newSteps.push({
      array: array.map((num) => ({
        value: num,
        isHighlighted: false,
        isProcessed: false,
        hasResult: false,
      })),
      stack: [],
      description: "Find days until warmer temperature",
      code: `# Initialize stack and result
stack = []
result = [0] * len(temperatures)`,
      currentIndex: -1,
    });

    for (let i = 0; i < array.length; i++) {
      while (stack.length > 0 && array[stack[stack.length - 1]] < array[i]) {
        const index = stack.pop()!;
        result[index] = i - index;
      }

      if (stack.length > 0 || i > 0) {
        const currentArray = array.map((num, idx) => ({
          value: num,
          isHighlighted: idx === i,
          isProcessed: idx < i,
          hasResult: result[idx] !== 0,
          result: result[idx] !== 0 ? result[idx] : undefined,
        }));

        const currentStack = stack.map((stackIdx, pos) => ({
          value: array[stackIdx],
          index: stackIdx,
          isActive: pos === stack.length - 1,
        }));

        newSteps.push({
          array: currentArray,
          stack: currentStack,
          description: `Temperature ${array[i]}°F at day ${i}`,
          code: `# Pop cooler days and calculate wait time
while stack and temperatures[stack[-1]] < temperatures[i]:
    index = stack.pop()
    result[index] = i - index`,
          currentIndex: i,
        });
      }

      stack.push(i);

      const currentArray = array.map((num, idx) => ({
        value: num,
        isHighlighted: idx === i,
        isProcessed: idx <= i,
        hasResult: result[idx] !== 0,
        result: result[idx] !== 0 ? result[idx] : undefined,
      }));

      const currentStack = stack.map((stackIdx, pos) => ({
        value: array[stackIdx],
        index: stackIdx,
        isActive: stackIdx === i,
      }));

      newSteps.push({
        array: currentArray,
        stack: currentStack,
        description: `Push day ${i} to stack`,
        code: `# Push current day to stack
stack.append(i)`,
        currentIndex: i,
      });
    }

    newSteps.push({
      array: array.map((num, idx) => ({
        value: num,
        isHighlighted: false,
        isProcessed: true,
        hasResult: true,
        result: result[idx],
      })),
      stack: [],
      description: `Days to wait: [${result.join(", ")}]`,
      code: `# Return result
return result`,
      currentIndex: -1,
    });

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

      let newSteps: Step[];
      switch (selectedAlgorithm) {
        case "next-greater":
          newSteps = generateNextGreaterSteps(numbers);
          break;
        case "next-smaller":
          newSteps = generateNextSmallerSteps(numbers);
          break;
        case "daily-temps":
          newSteps = generateDailyTempsSteps(numbers);
          break;
        default:
          newSteps = [];
      }

      setSteps(newSteps);
      setIsVisualizing(false);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Please enter valid numbers separated by commas"
      );
    }
  };

  const getFullCode = () => {
    switch (selectedAlgorithm) {
      case "next-greater":
        return `def next_greater_element(array):
    stack = []
    result = [-1] * len(array)
    
    for i in range(len(array)):
        while stack and array[stack[-1]] < array[i]:
            index = stack.pop()
            result[index] = array[i]
        stack.append(i)
    
    return result`;

      case "next-smaller":
        return `def next_smaller_element(array):
    stack = []
    result = [-1] * len(array)
    
    for i in range(len(array)):
        while stack and array[stack[-1]] > array[i]:
            index = stack.pop()
            result[index] = array[i]
        stack.append(i)
    
    return result`;

      case "daily-temps":
        return `def daily_temperatures(temperatures):
    stack = []
    result = [0] * len(temperatures)
    
    for i in range(len(temperatures)):
        while stack and temperatures[stack[-1]] < temperatures[i]:
            index = stack.pop()
            result[index] = i - index
        stack.append(i)
    
    return result`;

      default:
        return "";
    }
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
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Monotonic Stack
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Selection */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Select Algorithm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedAlgorithm("next-greater")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "next-greater"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Next Greater Element
            </button>
            <button
              onClick={() => setSelectedAlgorithm("next-smaller")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "next-smaller"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Next Smaller Element
            </button>
            <button
              onClick={() => setSelectedAlgorithm("daily-temps")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "daily-temps"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Daily Temperatures
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Input
          </h2>
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  selectedAlgorithm === "daily-temps"
                    ? "e.g., 73, 74, 75, 71, 69, 72, 76, 73"
                    : "e.g., 4, 5, 2, 25"
                }
              />
            </div>
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVisualizing ? "Visualizing..." : "Visualize"}
            </button>
          </div>
        </div>

        {/* Visualization Section */}
        {steps.length > 0 && (
          <div className="space-y-8">
            {/* Array Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Array Visualization
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {steps[currentStep].array.map((element, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-semibold transition-all duration-200 ${
                        element.isHighlighted
                          ? "bg-indigo-500 text-white"
                          : element.isProcessed
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {element.value}
                    </div>
                    {element.hasResult && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        {element.result}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {index}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Stack State
              </h2>
              <div className="flex flex-col-reverse items-center gap-2 min-h-[100px]">
                {steps[currentStep].stack.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400 italic">
                    Stack is empty
                  </div>
                ) : (
                  steps[currentStep].stack.map((element, index) => (
                    <div
                      key={index}
                      className={`w-20 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                        element.isActive
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-semibold">
                          {element.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          i:{element.index}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Step Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Step Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {steps[currentStep].description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentStep === 0}
                      className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentStep((prev) =>
                          Math.min(steps.length - 1, prev + 1)
                        )
                      }
                      disabled={currentStep === steps.length - 1}
                      className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(0)} variant="secondary">
                  Reset
                </Button>
              </div>
            </div>

            {/* Code Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Code
                </h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                >
                  <Code className="w-5 h-5" />
                  <span>
                    {showFullCode ? "Show Current Step" : "Show Full Code"}
                  </span>
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800">
                  {showFullCode ? getFullCode() : steps[currentStep].code}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Practice Questions */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-xl font-bold text-black dark:text-gray-200 mb-3">
            Practice Questions
          </h4>
          <div className="space-y-2"></div>
          <>
            <a
              href="https://leetcode.com/problems/next-greater-element-ii/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • LeetCode: Next Greater Element II
            </a>
            <a
              href="https://leetcode.com/problems/daily-temperatures/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • LeetCode: Daily Temperatures
            </a>
            <a
              href="https://practice.geeksforgeeks.org/problems/next-larger-element-1587115620/1"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • GFG: Next Larger Element
            </a>
          </>
        </div>
      </main>
    </div>
  );
}

export default MonotonicStackPage;
