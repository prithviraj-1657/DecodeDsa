"use client";

import { useState, useRef } from "react";
import { Layers, ArrowUp, ArrowDown, RotateCcw, BookOpen, Code } from "lucide-react";

// --- INTERFACES AND CONSTANTS ---
interface DequeOperation {
  name: string;
  description: string;
  timeComplexity: string;
  pythonCode: string;
  realWorldExample: string;
}

const dequeOperations: DequeOperation[] = [
  {
    name: "Add Front",
    description: "Inserts an element at the front of the deque.",
    timeComplexity: "O(1)",
    pythonCode: `deque.appendleft(x) # Adds x to front`,
    realWorldExample: "Undo functionality in text editors",
  },
  {
    name: "Add Rear",
    description: "Inserts an element at the rear of the deque.",
    timeComplexity: "O(1)",
    pythonCode: `deque.append(x) # Adds x to rear`,
    realWorldExample: "Task scheduling",
  },
  {
    name: "Remove Front",
    description: "Removes an element from the front of the deque.",
    timeComplexity: "O(1)",
    pythonCode: `deque.popleft() # Removes from front`,
    realWorldExample: "Processing queue in BFS",
  },
  {
    name: "Remove Rear",
    description: "Removes an element from the rear of the deque.",
    timeComplexity: "O(1)",
    pythonCode: `deque.pop() # Removes from rear`,
    realWorldExample: "Backtracking operations",
  },
];

// --- COMPONENT DEFINITION ---
function DequeVisualizerPage() {
  const [deque, setDeque] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string>("");

  const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // --- HELPER FUNCTIONS ---
  const addToHistory = (operation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationHistory((prev) => [`${timestamp}: ${operation}`, ...prev.slice(0, 19)]);
  };

  const handleAddFront = () => {
    if (!inputValue) return;
    setIsAnimating(true);
    const newDeque = [inputValue, ...deque];
    setDeque(newDeque);
    addToHistory(`✅ Added "${inputValue}" to front`);
    setLastOperation("add front");
    setInputValue("");
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleAddRear = () => {
    if (!inputValue) return;
    setIsAnimating(true);
    const newDeque = [...deque, inputValue];
    setDeque(newDeque);
    addToHistory(`✅ Added "${inputValue}" to rear`);
    setLastOperation("add rear");
    setInputValue("");
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleRemoveFront = () => {
    if (!deque.length) {
      addToHistory(`❌ Deque is empty`);
      return;
    }
    setIsAnimating(true);
    const removed = deque[0];
    setDeque(deque.slice(1));
    addToHistory(`🗑️ Removed "${removed}" from front`);
    setLastOperation("remove front");
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleRemoveRear = () => {
    if (!deque.length) {
      addToHistory(`❌ Deque is empty`);
      return;
    }
    setIsAnimating(true);
    const removed = deque[deque.length - 1];
    setDeque(deque.slice(0, -1));
    addToHistory(`🗑️ Removed "${removed}" from rear`);
    setLastOperation("remove rear");
    setTimeout(() => setIsAnimating(false), 500);
  };

  const clearDeque = () => {
    setDeque([]);
    addToHistory("🗑️ Deque cleared");
    setLastOperation("clear");
  };

  const getFullDequeCode = () => {
    return `from collections import deque

dq = deque()
dq.appendleft(x) # Add front
dq.append(x)     # Add rear
dq.popleft()     # Remove front
dq.pop()         # Remove rear`;
  };

  // --- RENDER FUNCTIONS ---
  const renderDequeElement = (value: string, index: number) => {
    return (
      <div
        key={index}
        ref={(el) => { if (el) nodeRefs.current.set(index, el); else nodeRefs.current.delete(index); }}
        className={`relative inline-flex items-center justify-center w-12 h-12 m-1 rounded-lg font-bold text-white shadow-md transition-transform duration-300 ${
          isAnimating ? "scale-110 bg-yellow-400" : "bg-purple-500"
        }`}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interactive Deque Visualizer
            </h1>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setShowTutorial(!showTutorial)} className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Tutorial</span>
            </button>
            <button onClick={() => setShowCode(!showCode)} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
              <Code className="w-5 h-5" />
              <span>Code</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tutorial Panel */}
        {showTutorial && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 dark:from-slate-700 dark:to-slate-800 dark:border-purple-900">
            <h2 className="text-xl font-bold text-purple-900 dark:text-white">Deque Data Structure</h2>
            <p className="text-purple-800 dark:text-gray-300 mt-2">
              A deque (double-ended queue) allows insertion and removal from both ends efficiently.
            </p>
          </div>
        )}

        {/* Operations Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Deque Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dequeOperations.map((op) => (
              <div
                key={op.name}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${ selectedOperation === op.name ? "border-purple-500 bg-purple-50 dark:bg-purple-950" : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50" }`}
                onClick={() => setSelectedOperation(selectedOperation === op.name ? null : op.name)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{op.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{op.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Time:</span><span className="font-mono text-green-600 dark:text-green-400">{op.timeComplexity}</span></div>
                </div>
                {selectedOperation === op.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Real-world Example:</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{op.realWorldExample}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-xs text-green-400 overflow-x-auto"><code>{op.pythonCode}</code></pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls & Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deque Controls</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value</label>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddRear()} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white" placeholder="Enter value"/>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button onClick={handleAddFront} disabled={isAnimating || !inputValue} className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center space-x-2"> <ArrowUp className="w-4 h-4" /> <span>Front</span> </button>
                <button onClick={handleAddRear} disabled={isAnimating || !inputValue} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center space-x-2"> <ArrowDown className="w-4 h-4" /> <span>Rear</span> </button>
                <button onClick={handleRemoveFront} className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex justify-center space-x-2"> <ArrowUp className="w-4 h-4" /> <span>Remove Front</span> </button>
                <button onClick={handleRemoveRear} className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex justify-center space-x-2"> <ArrowDown className="w-4 h-4" /> <span>Remove Rear</span> </button>
                <button onClick={clearDeque} className="col-span-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex justify-center space-x-2"> <RotateCcw className="w-4 h-4" /> <span>Clear</span> </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 min-h-[300px]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deque Visualization</h2>
              <div ref={containerRef} className="flex overflow-x-auto p-4 custom-scrollbar min-h-[80px]">
                {deque.length === 0 ? <div className="text-gray-500 italic mx-auto py-4">Deque is empty</div> : deque.map(renderDequeElement)}
              </div>
              {lastOperation && <div className="mt-6 text-center"><div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full"><span className="text-sm font-medium">Last Operation: {lastOperation.toUpperCase()}</span></div></div>}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operation History</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {operationHistory.length === 0 ? (<p className="text-gray-500 italic text-center py-8">No operations performed yet</p>) : (operationHistory.map((op, idx) => (<div key={idx} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">{op}</div>)))}
              </div>
            </div>

            {showCode && (
              <div className="bg-gray-900 rounded-2xl shadow-lg p-6 overflow-x-auto custom-scrollbar">
                <pre className="text-green-400 text-xs"><code>{getFullDequeCode()}</code></pre>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom CSS for scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #e0e0e0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>
    </div>
  );
}

export default DequeVisualizerPage;
