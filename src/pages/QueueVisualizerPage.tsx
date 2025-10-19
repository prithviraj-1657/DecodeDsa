"use client";

import { useState } from "react";
import {
  ListOrdered,
  Eye,
  AlertCircle,
  CheckCircle2,
  Code,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";


interface QueueOperation {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pythonCode: string;
  realWorldExample: string;
}

const queueOperations: QueueOperation[] = [
  {
    name: "Enqueue",
    description: "Adds an element to the rear (end) of the queue.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def enqueue(self, item):
    if self.is_full():
        raise QueueOverflowError("Queue is full")
    self.queue.append(item)
    self.size += 1`,
    realWorldExample:
      "Person joining the end of a line, adding print job to printer queue",
  },
  {
    name: "Dequeue",
    description:
      "Removes and returns the front (first) element from the queue.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def dequeue(self):
    if self.is_empty():
        raise QueueUnderflowError("Queue is empty")
    item = self.queue.pop(0)
    self.size -= 1
    return item`,
    realWorldExample:
      "First person in line being served, processing oldest print job",
  },
  {
    name: "Front/Peek",
    description: "Returns the front element without removing it.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def front(self):
    if self.is_empty():
        raise QueueUnderflowError("Queue is empty")
    return self.queue[0]`,
    realWorldExample: "Checking who's next in line without serving them",
  },
  {
    name: "Is Empty",
    description: "Checks if the queue has no elements.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    pythonCode: `def is_empty(self):
    return self.size == 0`,
    realWorldExample: "Checking if there are any customers waiting in line",
  },
];

interface QueueElement {
  value: number;
  isHighlighted: boolean;
  isNew: boolean;
  isRemoving: boolean;
  animationDelay: number;
}

function QueueVisualizerPage() {
  const [queue, setQueue] = useState<QueueElement[]>([]);
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

  const enqueue = () => {
    if (queue.length >= maxSize) {
      addToHistory("❌ Error: Queue Overflow! Cannot enqueue to full queue");
      return;
    }
    if (!inputValue || isNaN(Number(inputValue))) {
      addToHistory("❌ Error: Please enter a valid number");
      return;
    }

    setIsAnimating(true);
    setLastOperation("enqueue");
    const newElement: QueueElement = {
      value: Number(inputValue),
      isHighlighted: true,
      isNew: true,
      isRemoving: false,
      animationDelay: 0,
    };

    setQueue((prev) => [...prev, newElement]);
    addToHistory(`✅ Enqueued ${inputValue} to rear of queue`);
    setInputValue("");

    setTimeout(() => {
      setQueue((prev) =>
        prev.map((el) => ({ ...el, isHighlighted: false, isNew: false }))
      );
      setIsAnimating(false);
    }, 1000);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      addToHistory(
        "❌ Error: Queue Underflow! Cannot dequeue from empty queue"
      );
      return;
    }

    setIsAnimating(true);
    setLastOperation("dequeue");
    const dequeuedValue = queue[0].value;

    // Mark element as removing
    setQueue((prev) =>
      prev.map((el, idx) => (idx === 0 ? { ...el, isRemoving: true } : el))
    );

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      addToHistory(`✅ Dequeued ${dequeuedValue} from front of queue`);
      setIsAnimating(false);
    }, 500);
  };

  const front = () => {
    if (queue.length === 0) {
      addToHistory("❌ Error: Cannot peek at empty queue");
      return;
    }

    setIsAnimating(true);
    setLastOperation("front");
    const frontValue = queue[0].value;

    setQueue((prev) =>
      prev.map((el, idx) => (idx === 0 ? { ...el, isHighlighted: true } : el))
    );
    addToHistory(`👁️ Front element: ${frontValue}`);

    setTimeout(() => {
      setQueue((prev) => prev.map((el) => ({ ...el, isHighlighted: false })));
      setIsAnimating(false);
    }, 1500);
  };

  const isEmpty = () => {
    const empty = queue.length === 0;
    addToHistory(
      `🔍 Queue is ${empty ? "empty" : "not empty"} (size: ${queue.length})`
    );
  };

  const isFull = () => {
    const full = queue.length >= maxSize;
    addToHistory(
      `🔍 Queue is ${full ? "full" : "not full"} (${queue.length}/${maxSize})`
    );
  };

  const size = () => {
    addToHistory(`📏 Current queue size: ${queue.length}`);
  };

  const clearQueue = () => {
    setQueue([]);
    addToHistory("🗑️ Queue cleared");
  };

  const getFullQueueCode = () => {
    return `class Queue:
    def __init__(self, capacity=10):
        self.queue = []
        self.capacity = capacity
        self.size = 0
        self.front_index = 0
    
    def enqueue(self, item):
        """Add item to rear of queue"""
        if self.is_full():
            raise QueueOverflowError("Queue is full")
        self.queue.append(item)
        self.size += 1
        return True
    
    def dequeue(self):
        """Remove and return front item"""
        if self.is_empty():
            raise QueueUnderflowError("Queue is empty")
        item = self.queue.pop(0)
        self.size -= 1
        return item
    
    def front(self):
        """Return front item without removing"""
        if self.is_empty():
            raise QueueUnderflowError("Queue is empty")
        return self.queue[0]
    
    def rear(self):
        """Return rear item without removing"""
        if self.is_empty():
            raise QueueUnderflowError("Queue is empty")
        return self.queue[-1]
    
    def is_empty(self):
        """Check if queue is empty"""
        return self.size == 0
    
    def is_full(self):
        """Check if queue is full"""
        return self.size >= self.capacity
    
    def get_size(self):
        """Return current size"""
        return self.size
    
    def display(self):
        """Display queue contents"""
        if self.is_empty():
            print("Queue: []")
        else:
            print("Queue (front to rear):")
            for i, item in enumerate(self.queue):
                marker = " <- FRONT" if i == 0 else " <- REAR" if i == len(self.queue) - 1 else ""
                print(f"  [{i}] {item}{marker}")

# Circular Queue Implementation (more efficient)
class CircularQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = [None] * capacity
        self.front = 0
        self.rear = -1
        self.size = 0
    
    def enqueue(self, item):
        if self.is_full():
            raise QueueOverflowError("Queue is full")
        self.rear = (self.rear + 1) % self.capacity
        self.queue[self.rear] = item
        self.size += 1
    
    def dequeue(self):
        if self.is_empty():
            raise QueueUnderflowError("Queue is empty")
        item = self.queue[self.front]
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return item

# Example usage:
queue = Queue(capacity=5)
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)
print(f"Front element: {queue.front()}")    # 10
print(f"Dequeued: {queue.dequeue()}")       # 10
print(f"Size: {queue.get_size()}")          # 2`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3 min-h-[110px]">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <ListOrdered className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Interactive Queue Visualizer
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Master queue operations with visual learning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                <span>Tutorial</span>
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">
                Queue Data Structure
              </h2>
            </div>
            <p className="text-blue-800 mb-4">
              A queue is a linear data structure that follows the First In,
              First Out (FIFO) principle. Think of it like a line at a store -
              the first person in line is the first to be served.
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
                  Task scheduling, breadth-first search, print queues
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
                  FIFO - First In, First Out
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Operations Overview */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Queue Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {queueOperations.map((operation) => (
              <div
                key={operation.name}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedOperation === operation.name
                    ? "border-blue-500 bg-blue-50"
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
                Queue Controls
              </h2>

              {/* Configuration */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Queue Capacity
                  </label>
                  <input
                    type="number"
                    value={maxSize}
                    onChange={(e) =>
                      setMaxSize(
                        Math.max(1, Math.min(15, Number(e.target.value)))
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value to Enqueue
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && enqueue()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onClick={enqueue}
                      disabled={
                        isAnimating || !inputValue || isNaN(Number(inputValue))
                      }
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Enqueue</span>
                    </button>
                    <button
                      onClick={dequeue}
                      disabled={isAnimating || queue.length === 0}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Dequeue</span>
                    </button>
                    <button
                      onClick={front}
                      disabled={isAnimating || queue.length === 0}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Front</span>
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
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
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
                      onClick={clearQueue}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Queue Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Queue Status
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-mono">
                      {queue.length}/{maxSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empty:</span>
                    <span
                      className={
                        queue.length === 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      {queue.length === 0 ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full:</span>
                    <span
                      className={
                        queue.length >= maxSize
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {queue.length >= maxSize ? "Yes" : "No"}
                    </span>
                  </div>
                  {queue.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Front:</span>
                        <span className="font-mono">{queue[0].value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rear:</span>
                        <span className="font-mono">
                          {queue[queue.length - 1].value}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Queue Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Queue Visualization
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>Capacity: {maxSize}</span>
                  <span>Size: {queue.length}</span>
                </div>
              </div>

              {/* Queue Container */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Queue Elements */}
                  <div className="flex items-center space-x-2 min-h-[80px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    {queue.length === 0 ? (
                      <div className="flex items-center justify-center w-full text-gray-400">
                        <div className="text-center">
                          <ListOrdered className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Empty Queue</p>
                        </div>
                      </div>
                    ) : (
                      queue.map((element, index) => (
                        <div
                          key={index}
                          className={`relative w-16 h-16 flex items-center justify-center text-white font-bold text-lg rounded-lg transition-all duration-500 transform ${
                            element.isRemoving
                              ? "scale-110 opacity-0 -translate-x-8"
                              : element.isHighlighted
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 scale-105 shadow-lg"
                              : element.isNew
                              ? "bg-gradient-to-r from-green-400 to-blue-500 scale-105"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500"
                          }`}
                          style={{
                            animationDelay: `${element.animationDelay}ms`,
                          }}
                        >
                          {element.value}

                          {/* Front indicator */}
                          {index === 0 && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                              <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-blue-600">
                                  FRONT
                                </span>
                                <ArrowLeft className="w-3 h-3 text-blue-600" />
                              </div>
                            </div>
                          )}

                          {/* Rear indicator */}
                          {index === queue.length - 1 && queue.length > 1 && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                              <div className="flex flex-col items-center">
                                <ArrowRight className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-medium text-green-600">
                                  REAR
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Direction indicators */}
                  {queue.length > 0 && (
                    <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
                      <div className="flex flex-col items-center text-xs text-gray-500">
                        <span>Dequeue</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {queue.length > 0 && (
                    <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                      <div className="flex flex-col items-center text-xs text-gray-500">
                        <span>Enqueue</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Operation Indicator */}
              {lastOperation && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
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

              {/* Practice Questions Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mt-8">
                <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">
                  Practice Questions (Queue)
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://leetcode.com/problems/implement-queue-using-stacks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Implement Queue using Stacks (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/design-circular-queue/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Design Circular Queue (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/number-of-recent-calls/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Number of Recent Calls (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/sliding-window-maximum/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Sliding Window Maximum (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/queue-reversal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Queue Reversal (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      First Negative Integer in Every Window of Size K (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/interleave-the-first-half-of-the-queue-with-second-half/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Interleave the First Half of the Queue with Second Half (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/queue-using-two-stacks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Queue using Two Stacks (GFG)
                    </a>
                  </li>
                </ul>
              </div>

            {/* Full Code Implementation */}
            {showCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Complete Queue Implementation
                </h2>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{getFullQueueCode()}</code>
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

export default QueueVisualizerPage;


