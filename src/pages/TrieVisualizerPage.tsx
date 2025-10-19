"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  // Unused icons removed from this list
  Layers,
  Eye,
  Code,
  BookOpen,
  ArrowUp,
  RotateCcw,
} from "lucide-react";

// --- INTERFACES AND CONSTANTS ---
interface TrieOperation {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pythonCode: string;
  realWorldExample: string;
}

const trieOperations: TrieOperation[] = [
  {
    name: "Insert",
    description: "Inserts a word into the trie.",
    timeComplexity: "O(L) (L = word length)",
    spaceComplexity: "O(L)",
    pythonCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True`,
    realWorldExample: "Autocomplete feature in search engines",
  },
  {
    name: "Search",
    description: "Searches for a word in the trie.",
    timeComplexity: "O(L)",
    spaceComplexity: "O(1)",
    pythonCode: `def search(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            return False
        node = node.children[char]
    return node.is_end_of_word`,
    realWorldExample: "Checking if a word exists in a dictionary",
  },
  {
    name: "StartsWith",
    description: "Checks if any word starts with given prefix.",
    timeComplexity: "O(L)",
    spaceComplexity: "O(1)",
    pythonCode: `def starts_with(self, prefix):
    node = self.root
    for char in prefix:
        if char not in node.children:
            return False
        node = node.children[char]
    return True`,
    realWorldExample: "Autocomplete suggestions",
  },
];

interface TrieNodeElement {
  char: string;
  children: TrieNodeElement[];
  isEndOfWord: boolean;
  isHighlighted: boolean;
  isNew?: boolean;
}

let trieUpdateKey = 0;

// --- COMPONENT DEFINITION ---
function TrieVisualizerPage() {
  const [trieRoot, setTrieRoot] = useState<TrieNodeElement>({
    char: "",
    children: [],
    isEndOfWord: false,
    isHighlighted: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string>("");

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- HELPER & LOGIC FUNCTIONS ---
  const addToHistory = (operation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationHistory((prev) => [`${timestamp}: ${operation}`, ...prev.slice(0, 19)]);
  };

  const insertWord = (node: TrieNodeElement, word: string): TrieNodeElement => {
    if (!word.length) {
      node.isEndOfWord = true;
      return node;
    }
    const char = word[0];
    let childNode = node.children.find((c) => c.char === char);

    if (!childNode) {
      childNode = { char, children: [], isEndOfWord: false, isHighlighted: true, isNew: true };
      node.children.push(childNode);
      node.children.sort((a, b) => a.char.localeCompare(b.char));
    } else {
      childNode.isHighlighted = true;
      childNode.isNew = false;
    }

    const updatedChild = insertWord(childNode, word.slice(1));
    node.children = node.children.map((c) => (c.char === updatedChild.char ? updatedChild : c));
    return node;
  };

  const searchWord = (node: TrieNodeElement, word: string): boolean => {
    if (!word.length) return node.isEndOfWord;
    const char = word[0];
    const childNode = node.children.find((c) => c.char === char);
    if (!childNode) return false;
    childNode.isHighlighted = true;
    return searchWord(childNode, word.slice(1));
  };

  const resetHighlight = (node: TrieNodeElement) => {
    node.isHighlighted = false;
    node.children.forEach(resetHighlight);
  };

  const getFullTrieCode = () => {
    return `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`;
  };

  // --- HANDLER FUNCTIONS ---
  const handleInsert = () => {
    const word = inputValue.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) {
      addToHistory(`❌ Error: Please enter a valid word.`);
      return;
    }

    setIsAnimating(true);
    setLastOperation("insert");
    trieUpdateKey += 1;

    const newRoot = JSON.parse(JSON.stringify(trieRoot));
    const updatedRoot = insertWord(newRoot, word);
    setTrieRoot(updatedRoot);
    addToHistory(`✅ Inserted "${word}" into trie`);
    setInputValue("");

    setTimeout(() => {
      const stateToReset = JSON.parse(JSON.stringify(updatedRoot));
      const resetFlags = (node: TrieNodeElement) => {
        node.isHighlighted = false;
        node.isNew = false;
        node.children.forEach(resetFlags);
      };
      resetFlags(stateToReset);
      setTrieRoot(stateToReset);
      setIsAnimating(false);
    }, 1000);
  };

  const handleSearch = () => {
    const word = inputValue.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) {
      addToHistory(`❌ Error: Please enter a valid word.`);
      return;
    }

    setIsAnimating(true);
    setLastOperation("search");
    const newRoot = JSON.parse(JSON.stringify(trieRoot));
    const found = searchWord(newRoot, word);
    setTrieRoot(newRoot);
    addToHistory(`🔍 Search "${word}": ${found ? "Found ✅" : "Not Found ❌"}`);
    setInputValue("");

    setTimeout(() => {
      const stateToReset = JSON.parse(JSON.stringify(newRoot));
      resetHighlight(stateToReset);
      setTrieRoot(stateToReset);
      setIsAnimating(false);
    }, 1000);
  };

  const clearTrie = () => {
    setTrieRoot({ char: "", children: [], isEndOfWord: false, isHighlighted: false });
    addToHistory("🗑️ Trie cleared");
    trieUpdateKey += 1;
  };

  // --- DRAWING LOGIC & EFFECTS ---
  const drawLines = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = svgRef.current;
    const container = containerRef.current;
    
    svg.style.width = `${container.scrollWidth}px`;
    svg.style.height = `${container.scrollHeight}px`;
    
    const containerRect = container.getBoundingClientRect();
    while (svg.lastChild) svg.removeChild(svg.lastChild);

    const traverseAndDraw = (node: TrieNodeElement, path: string) => {
      const parentKey = path + node.char;
      const parentRef = nodeRefs.current.get(parentKey);

      if (parentRef) {
        const parentRect = parentRef.getBoundingClientRect();
        node.children.forEach((child) => {
          const childKey = parentKey + child.char;
          const childRef = nodeRefs.current.get(childKey);
          if (childRef) {
            const childRect = childRef.getBoundingClientRect();
            
            const pX = parentRect.left + parentRect.width / 2 - containerRect.left + container.scrollLeft;
            const pY = parentRect.bottom - containerRect.top + container.scrollTop;
            const cX = childRect.left + childRect.width / 2 - containerRect.left + container.scrollLeft;
            const cY = childRect.top - containerRect.top + container.scrollTop;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", String(pX));
            line.setAttribute("y1", String(pY));
            line.setAttribute("x2", String(cX));
            line.setAttribute("y2", String(cY));
            line.setAttribute("stroke", "rgb(156 163 175)");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
          }
          traverseAndDraw(child, parentKey);
        });
      }
    };
    traverseAndDraw(trieRoot, "");
  }, [trieRoot]);

  useEffect(() => {
    const timeoutId = setTimeout(drawLines, 50);
    const container = containerRef.current;
    
    window.addEventListener("resize", drawLines);
    if (container) {
      container.addEventListener("scroll", drawLines);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", drawLines);
      if (container) {
        container.removeEventListener("scroll", drawLines);
      }
    };
  }, [trieRoot, drawLines, isAnimating]);

  // --- RENDER FUNCTIONS ---
  const renderTrieNode = (node: TrieNodeElement, path: string = "") => {
    const key = path + node.char;

    if (!node.char && !node.children.length && path === "") {
      return <div className="text-gray-500 italic text-center py-4">Trie is empty. Insert a word to start.</div>;
    }

    const nodeContent = (
      <div
        ref={(el) => { if (el) nodeRefs.current.set(key, el); else nodeRefs.current.delete(key); }}
        className={`relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm text-white transition-all duration-300 transform ${
          node.char === ""
            ? "bg-gray-400 dark:bg-gray-600 shadow-md text-gray-800 dark:text-gray-200"
            : node.isHighlighted
            ? "bg-yellow-400 ring-4 ring-yellow-200 scale-110 shadow-lg animate-highlight-pulse"
            : node.isEndOfWord
            ? "bg-green-500 ring-2 ring-green-300 shadow-md"
            : "bg-purple-500 shadow-md"
        } ${node.isNew ? "animate-pulse-in" : ""}`}
      >
        {node.char === "" ? "R" : node.char.toUpperCase()}
      </div>
    );

    return (
      <div key={key} className="flex flex-col items-center">
        {nodeContent}
        {node.children.length > 0 && (
          <div className="flex justify-center mt-8">
            {node.children.map((child) => (
              <div key={path + node.char + child.char} className="flex flex-col items-center px-4">
                {renderTrieNode(child, path + node.char)}
              </div>
            ))}
          </div>
        )}
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
              Interactive Trie Visualizer
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
             {/* You can add back the tutorial content and re-import the icons if you need them */}
             <h2 className="text-xl font-bold text-purple-900 dark:text-white">Trie Data Structure</h2>
             <p className="text-purple-800 dark:text-gray-300 mt-2">
                A Trie (or Prefix Tree) is a tree-like data structure used to store a dynamic set of strings.
              </p>
          </div>
        )}

        {/* Operations Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trie Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trieOperations.map((operation) => (
              <div
                key={operation.name}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${ selectedOperation === operation.name ? "border-purple-500 bg-purple-50 dark:bg-purple-950" : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50" }`}
                onClick={() => setSelectedOperation(selectedOperation === operation.name ? null : operation.name)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{operation.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{operation.description}</p>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Time:</span><span className="font-mono text-green-600 dark:text-green-400">{operation.timeComplexity}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Space:</span><span className="font-mono text-blue-600 dark:text-blue-400">{operation.spaceComplexity}</span></div>
                </div>
                {selectedOperation === operation.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Real-world Example:</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{operation.realWorldExample}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-xs text-green-400 overflow-x-auto"><code>{operation.pythonCode}</code></pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Controls & Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trie Controls</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Word</label>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))} onKeyPress={(e) => e.key === "Enter" && handleInsert()} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white" placeholder="Enter word (a-z)"/>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4">
                <button onClick={handleInsert} disabled={isAnimating || !inputValue} className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center space-x-2"> <ArrowUp className="w-4 h-4" /> <span>Insert</span> </button>
                <button onClick={handleSearch} disabled={isAnimating || !inputValue} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center space-x-2"> <Eye className="w-4 h-4" /> <span>Search</span> </button>
                <button onClick={clearTrie} className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex justify-center space-x-2"> <RotateCcw className="w-4 h-4" /> <span>Clear</span> </button>
              </div>
            </div>
          </div>

          {/* Visualization & History Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 min-h-[300px] relative">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trie Visualization</h2>
              <div ref={containerRef} className="relative overflow-x-auto p-4 custom-scrollbar">
                <svg ref={svgRef} className="absolute top-0 left-0 pointer-events-none"></svg>
                <div key={trieUpdateKey} className="flex justify-center pt-8 min-w-max">
                  {renderTrieNode(trieRoot, "")}
                </div>
              </div>
              {lastOperation && (
                <div className="mt-6 text-center"><div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full"><span className="text-sm font-medium">Last Operation: {lastOperation.toUpperCase()}</span></div></div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operation History</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {operationHistory.length === 0 ? (<p className="text-gray-500 italic text-center py-8">No operations performed yet</p>) : (operationHistory.map((op, idx) => (<div key={idx} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">{op}</div>)))}
              </div>
            </div>

              {/* Practice Questions Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mt-8">
                <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4">
                  Practice Questions (Trie)
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://leetcode.com/problems/implement-trie-prefix-tree/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Implement Trie (Prefix Tree) (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/word-search-ii/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Word Search II (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/replace-words/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Replace Words (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/problems/longest-word-in-dictionary/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Longest Word in Dictionary (LeetCode)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/trie-insert-and-search/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Trie Insert and Search (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/word-break/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Word Break (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/phone-directory/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Phone Directory (GFG)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://practice.geeksforgeeks.org/problems/unique-prefix-for-every-word/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Unique Prefix for Every Word (GFG)
                    </a>
                  </li>
                </ul>
              </div>

            {showCode && (
              <div className="bg-gray-900 rounded-2xl shadow-lg p-6 overflow-x-auto custom-scrollbar">
                <pre className="text-green-400 text-xs"><code>{getFullTrieCode()}</code></pre>
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

export default TrieVisualizerPage;