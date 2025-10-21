"use client";

import { useState } from "react";
import {
  Layers,
  Eye,
  AlertCircle,
  CheckCircle2,
  Code,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  Zap,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";


interface StackOperation {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pythonCode: string;
  realWorldExample: string;
}

const stackOperations: StackOperation[] = [
  {
    name: "Push",
    description: "Adds an element to the top of the stack.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def push(self, item):
    if self.is_full():
        raise StackOverflowError("Stack is full")
    self.stack.append(item)
    self.size += 1`,
    realWorldExample: "Adding a new browser tab, function call in recursion",
  },
  {
    name: "Pop",
    description: "Removes and returns the top element from the stack.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def pop(self):
    if self.is_empty():
        raise StackUnderflowError("Stack is empty")
    item = self.stack.pop()
    self.size -= 1
    return item`,
    realWorldExample:
      "Closing the most recent browser tab, returning from function",
  },
  {
    name: "Peek/Top",
    description: "Returns the top element without removing it.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def peek(self):
    if self.is_empty():
        raise StackUnderflowError("Stack is empty")
    return self.stack[-1]`,
    realWorldExample: "Viewing current browser tab without switching",
  },
  {
    name: "Is Empty",
    description: "Checks if the stack has no elements.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def is_empty(self):
    return self.size == 0`,
    realWorldExample: "Checking if there are any function calls to return to",
  },
];

interface StackElement {
  value: number;
  isHighlighted: boolean;
  isNew: boolean;
  isRemoving: boolean;
  animationDelay: number;
}

function StackVisualizerPage() {
  const [stack, setStack] = useState<StackElement[]>([]);
  const [maxSize, setMaxSize] = useState<number>(8);
  const [inputValue, setInputValue] = useState<string>("");
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null
  );
  const [lastOperation, setLastOperation] = useState<string>("");

  const addToHistory = (operation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationHistory((prev) => [
      `${timestamp}: ${operation}`,
      ...prev.slice(0, 19),
    ]);
  };

  const push = () => {
    if (stack.length >= maxSize) {
      addToHistory("❌ Error: Stack Overflow! Cannot push to full stack");
      return;
    }
    if (!inputValue || isNaN(Number(inputValue))) {
      addToHistory("❌ Error: Please enter a valid number");
      return;
    }

    setIsAnimating(true);
    setLastOperation("push");
    const newElement: StackElement = {
      value: Number(inputValue),
      isHighlighted: true,
      isNew: true,
      isRemoving: false,
      animationDelay: 0,
    };

    setStack((prev) => [...prev, newElement]);
    addToHistory(`✅ Pushed ${inputValue} onto stack`);
    setInputValue("");

    setTimeout(() => {
      setStack((prev) =>
        prev.map((el) => ({ ...el, isHighlighted: false, isNew: false }))
      );
      setIsAnimating(false);
    }, 1000);
  };

  const pop = () => {
    if (stack.length === 0) {
      addToHistory("❌ Error: Stack Underflow! Cannot pop from empty stack");
      return;
    }

    setIsAnimating(true);
    setLastOperation("pop");
    const poppedValue = stack[stack.length - 1].value;

    // Mark element as removing
    setStack((prev) =>
      prev.map((el, idx) =>
        idx === prev.length - 1 ? { ...el, isRemoving: true } : el
      )
    );

    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      addToHistory(`✅ Popped ${poppedValue} from stack`);
      setIsAnimating(false);
    }, 500);
  };

  const peek = () => {
    if (stack.length === 0) {
      addToHistory("❌ Error: Cannot peek at empty stack");
      return;
    }

    setIsAnimating(true);
    setLastOperation("peek");
    const topValue = stack[stack.length - 1].value;

    setStack((prev) =>
      prev.map((el, idx) =>
        idx === prev.length - 1 ? { ...el, isHighlighted: true } : el
      )
    );
    addToHistory(`👁️ Peeked at top element: ${topValue}`);

    setTimeout(() => {
      setStack((prev) => prev.map((el) => ({ ...el, isHighlighted: false })));
      setIsAnimating(false);
    }, 1500);
  };

  const isEmpty = () => {
    const empty = stack.length === 0;
    addToHistory(
      `🔍 Stack is ${empty ? "empty" : "not empty"} (size: ${stack.length})`
    );
  };

  const isFull = () => {
    const full = stack.length >= maxSize;
    addToHistory(
      `🔍 Stack is ${full ? "full" : "not full"} (${stack.length}/${maxSize})`
    );
  };

  const size = () => {
    addToHistory(`📏 Current stack size: ${stack.length}`);
  };

  const clearStack = () => {
    setStack([]);
    addToHistory("🗑️ Stack cleared");
  };

  const getFullStackCode = () => {
    return `class Stack:
    def __init__(self, capacity=10):
        self.stack = []
        self.capacity = capacity
        self.size = 0
    
    def push(self, item):
        """Add item to top of stack"""
        if self.is_full():
            raise StackOverflowError("Stack is full")
        self.stack.append(item)
        self.size += 1
        return True
    
    def pop(self):
        """Remove and return top item"""
        if self.is_empty():
            raise StackUnderflowError("Stack is empty")
        item = self.stack.pop()
        self.size -= 1
        return item
    
    def peek(self):
        """Return top item without removing"""
        if self.is_empty():
            raise StackUnderflowError("Stack is empty")
        return self.stack[-1]
    
    def is_empty(self):
        """Check if stack is empty"""
        return self.size == 0
    
    def is_full(self):
        """Check if stack is full"""
        return self.size >= self.capacity
    
    def get_size(self):
        """Return current size"""
        return self.size
    
    def display(self):
        """Display stack contents"""
        if self.is_empty():
            print("Stack: []")
        else:
            print("Stack (top to bottom):")
            for i in range(len(self.stack) - 1, -1, -1):
                print(f"  [{i}] {self.stack[i]}")

# Example usage:
stack = Stack(capacity=5)
stack.push(10)
stack.push(20)
stack.push(30)
print(f"Top element: {stack.peek()}")  # 30
print(f"Popped: {stack.pop()}")        # 30
print(f"Size: {stack.get_size()}")     # 2`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3 min-h-[110px]">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Interactive Stack Visualizer
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300 dark:text-gray-300">
                  Master stack operations with visual learning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                <span>Tutorial</span>
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Code className="w-5 h-5 md:w-6 md:h-6" />
                <span>Code</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tutorial Panel */}
        {showTutorial && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-purple-900">
                Stack Data Structure
              </h2>
            </div>
            <p className="text-purple-800 mb-4">
              A stack is a linear data structure that follows the Last In, First
              Out (LIFO) principle. Think of it like a stack of plates - you can
              only add or remove plates from the top.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Time Complexity
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  All operations: O(1) - Constant time
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Use Cases</span>
                </div>
                <p className="text-sm text-blue-700">
                  Function calls, undo operations, expression evaluation
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Key Property
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  LIFO - Last In, First Out
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Operations Overview */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Stack Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stackOperations.map((operation) => (
              <div
                key={operation.name}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedOperation === operation.name
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedOperation(
                    selectedOperation === operation.name ? null : operation.name
                  )
                }
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {operation.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {operation.description}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-mono text-green-600">
                      {operation.timeComplexity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Space:</span>
                    <span className="font-mono text-blue-600">
                      {operation.spaceComplexity}
                    </span>
                  </div>
                </div>
                {selectedOperation === operation.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">
                        Real-world Example:
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {operation.realWorldExample}
                      </p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-xs text-green-400 overflow-x-auto">
                        <code>{operation.pythonCode}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Stack Controls
              </h2>

              {/* Configuration */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stack Capacity
                  </label>
                  <input
                    type="number"
                    value={maxSize}
                    onChange={(e) =>
                      setMaxSize(
                        Math.max(1, Math.min(15, Number(e.target.value)))
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    max="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value to Push
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && push()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter a number"
                  />
                </div>
              </div>

              {/* Operation Buttons */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Primary Operations
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={push}
                      disabled={
                        isAnimating || !inputValue || isNaN(Number(inputValue))
                      }
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                      <span>Push</span>
                    </button>
                    <button
                      onClick={pop}
                      disabled={isAnimating || stack.length === 0}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                      <span>Pop</span>
                    </button>
                    <button
                      onClick={peek}
                      disabled={isAnimating || stack.length === 0}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Peek</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Query Operations
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={isEmpty}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>Empty?</span>
                    </button>
                    <button
                      onClick={isFull}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Full?</span>
                    </button>
                    <button
                      onClick={size}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <span>Size</span>
                    </button>
                    <button
                      onClick={clearStack}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stack Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Stack Status
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-mono">
                      {stack.length}/{maxSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empty:</span>
                    <span
                      className={
                        stack.length === 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      {stack.length === 0 ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full:</span>
                    <span
                      className={
                        stack.length >= maxSize
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {stack.length >= maxSize ? "Yes" : "No"}
                    </span>
                  </div>
                  {stack.length > 0 && (
                    <div className="flex justify-between">
                      <span>Top:</span>
                      <span className="font-mono">
                        {stack[stack.length - 1].value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stack Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Stack Visualization
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>Capacity: {maxSize}</span>
                  <span>Size: {stack.length}</span>
                </div>
              </div>

              {/* Stack Container */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Stack Base */}
                  <div className="w-32 h-8 bg-gray-800 rounded-b-lg"></div>

                  {/* Stack Elements */}
                  <div className="flex flex-col-reverse space-y-reverse space-y-1">
                    {stack.map((element, index) => (
                      <div
                        key={index}
                        className={`w-32 h-12 flex items-center justify-center text-white font-bold text-lg rounded-lg transition-all duration-500 transform ${
                          element.isRemoving
                            ? "scale-110 opacity-0 translate-y-4"
                            : element.isHighlighted
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 scale-105 shadow-lg"
                            : element.isNew
                            ? "bg-gradient-to-r from-green-400 to-blue-500 scale-105"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                        style={{
                          animationDelay: `${element.animationDelay}ms`,
                        }}
                      >
                        {element.value}
                        {index === stack.length - 1 && (
                          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                            <div className="flex items-center space-x-2">
                              <ArrowUp className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-600">
                                TOP
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {stack.length === 0 && (
                    <div className="w-32 h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Empty Stack</p>
                      </div>
                    </div>
                  )}

                  {/* Capacity Indicator */}
                  <div className="absolute -left-16 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                    {Array.from({ length: maxSize }, (_, i) => (
                      <div key={i} className="h-12 flex items-center">
                        {maxSize - i - 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operation Indicator */}
              {lastOperation && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                    <span className="text-sm font-medium">
                      Last Operation: {lastOperation.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Operation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Operation History
              </h2>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {operationHistory.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">
                    No operations performed yet
                  </p>
                ) : (
                  operationHistory.map((operation, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm border-l-4 ${
                        operation.includes("❌")
                          ? "bg-red-50 text-red-700 border-red-400"
                          : operation.includes("✅")
                          ? "bg-green-50 text-green-700 border-green-400"
                          : operation.includes("👁️")
                          ? "bg-blue-50 text-blue-700 border-blue-400"
                          : "bg-gray-50 text-gray-700 border-gray-400"
                      }`}
                    >
                      {operation}
                    </div>
                  ))
                )}
              </div>
            </div>

                          {/* Practice Questions Section - Card Style */}
                          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 p-6 mt-8">
                            <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4">Practice Questions (Stack)</h2>
                            <ul className="space-y-3">
                              <li>
                                <a href="https://leetcode.com/problems/valid-parentheses/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Valid Parentheses (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/min-stack/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Min Stack (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/daily-temperatures/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Daily Temperatures (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/largest-rectangle-in-histogram/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Largest Rectangle in Histogram (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/implement-stack-using-queues/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Implement Stack using Queues (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/stack-using-two-queues/1" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Stack using Two Queues (GFG)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/next-larger-element-1587115620/1" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Next Larger Element (GFG)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/get-minimum-element-from-stack/1" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Get Minimum Element from Stack (GFG)</a>
                              </li>
                            </ul>
                          </div>

            {/* Full Code Implementation */}
            {showCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Complete Stack Implementation
                </h2>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{getFullStackCode()}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StackVisualizerPage;





