"use client";

import { useState } from "react";
import {
  List,
  Plus,
  Minus,
  RotateCcw,
  Code,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
} from "lucide-react";


// Enhanced Node interface with animation states
interface ListNode {
  id: string;
  value: number;
  next: ListNode | null;
  prev?: ListNode | null;
  isHighlighted?: boolean;
  isNew?: boolean;
  isDeleting?: boolean;
  isModifying?: boolean;
  animationDelay?: number;
}

type ListType = "singly" | "doubly" | "circular";

// 1. Define a new type for supported code operations:
type CodeOperationType = "insert-beginning" | "insert-end" | "insert-position" | "delete-beginning" | "delete-end" | "delete-position" | "search";

function LinkedListVisualizerPage() {
  const [listType, setListType] = useState<ListType>("singly");
  const [head, setHead] = useState<ListNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [position, setPosition] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Renamed searchValue to searchTerm

  // UI states
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(0);

  const [showStepByStep, setShowStepByStep] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<
    CodeOperationType | ""
  >(""); 

  // Add these interfaces and types after existing interfaces
  interface CodeStructure {
    structure: string;
    operations: Record<string, string>;
  }

  interface LinkedListCodes {
    [key: string]: CodeStructure;
  }

  // Add this function after the existing state declarations
  const getLinkedListCode = (type: ListType): CodeStructure => {
    const codes: LinkedListCodes = {
      singly: {
        structure: `class SinglyNode {
  value: number;
  next: Node | null;
  
  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  head: Node | null;
  
  constructor() {
    this.head = null;
  }
}`,
        operations: {
          insertAtBeginning: `insertAtBeginning(value: number): void {
  const newNode = new Node(value);
  newNode.next = this.head;
  this.head = newNode;
}`,
          insertAtEnd: `insertAtEnd(value: number): void {
  const newNode = new Node(value);
  if (!this.head) {
    this.head = newNode;
    return;
  }
  let current = this.head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
}`,
          deleteAtBeginning: `deleteAtBeginning(): void {
  if (!this.head) return;
  this.head = this.head.next;
}`,
          deleteAtEnd: `deleteAtEnd(): void {
  if (!this.head) return;
  if (!this.head.next) {
    this.head = null;
    return;
  }
  let current = this.head;
  while (current.next?.next) {
    current = current.next;
  }
  current.next = null;
}`
        }
      },
      doubly: {
        structure: `class DoublyNode {
  value: number;
  next: Node | null;
  prev: Node | null;
  
  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}`,
        operations: {
          insertAtBeginning: `insertAtBeginning(value: number): void {
  const newNode = new DoublyNode(value);
  newNode.next = this.head;
  if (this.head) {
    this.head.prev = newNode;
  }
  this.head = newNode;
}`,
          insertAtEnd: `insertAtEnd(value: number): void {
  const newNode = new DoublyNode(value);
  if (!this.head) {
    this.head = newNode;
    return;
  }
  let current = this.head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  newNode.prev = current;
}`
        }
      },
      circular: {
        structure: `class CircularNode {
  value: number;
  next: Node;
  
  constructor(value: number) {
    this.value = value;
    this.next = this;
  }
}`,
        operations: {
          insertAtBeginning: `insertAtBeginning(value: number): void {
  const newNode = new CircularNode(value);
  if (!this.head) {
    newNode.next = newNode;
    this.head = newNode;
    return;
  }
  let current = this.head;
  while (current.next !== this.head) {
    current = current.next;
  }
  newNode.next = this.head;
  current.next = newNode;
  this.head = newNode;
}`
        }
      }
    };

    return codes[type];
  }


  // Helper functions
  const generateNodeId = () => {
    setNodeCounter((prev) => prev + 1);
    return `node-${nodeCounter}`;
  };

  const createNode = (value: number): ListNode => ({
    id: generateNodeId(),
    value,
    next: null,
    isNew: true,
  });

  const createDoublyNode = (value: number): ListNode => ({
    id: generateNodeId(),
    value,
    next: null,
    prev: null,
    isNew: true,
  });

  const toArray = (): ListNode[] => {
    const arr: ListNode[] = [];
    let curr = head;
    if (!curr) return arr;

    if (listType === "circular") {
      do {
        arr.push(curr);
        curr = curr.next;
      } while (curr && curr !== head && arr.length < 20); // Prevent infinite loop
    } else {
      while (curr) {
        arr.push(curr);
        curr = curr.next;
      }
    }
    return arr;
  };

  const insertAtBeginning = async (value: number) => {
    const newNode =
      listType === "doubly" ? createDoublyNode(value) : createNode(value);

    if (!head) {
      if (listType === "circular") {
        newNode.next = newNode;
        setHead(newNode);
      } else {
        setHead(newNode);
      }
    } else {
      if (listType === "doubly") {
        newNode.next = head;
        head.prev = newNode;
      } else if (listType === "circular") {
        // Find tail for circular
        let tail = head;
        while (tail.next && tail.next !== head) {
          tail = tail.next;
        }
        newNode.next = head;
        tail.next = newNode;
      } else {
        newNode.next = head;
      }
      setHead(newNode);
    }

    addToHistory(`Inserted ${value} at beginning`);
  };

  const insertAtEnd = async (value: number) => {
    const newNode =
      listType === "doubly" ? createDoublyNode(value) : createNode(value);

    if (!head) {
      setHead(newNode);
    } else {
      let curr = head;
      if (listType === "circular") {
        while (curr.next && curr.next !== head) {
          curr = curr.next;
        }
        curr.next = newNode;
        newNode.next = head;
      } else {
        while (curr.next) {
          curr = curr.next;
        }
        curr.next = newNode;
        if (listType === "doubly") {
          newNode.prev = curr;
        }
      }
      setHead({ ...head });
    }

    addToHistory(`Inserted ${value} at end`);
  };

  const deleteAtBeginning = async () => {
    if (!head) {
      addToHistory("Cannot delete from empty list");
      return;
    }

    if (listType === "circular" && head.next === head) {
      setHead(null);
    } else if (listType === "circular") {
      // Find tail and update its next pointer
      let tail = head;
      while (tail.next && tail.next !== head) {
        tail = tail.next;
      }
      const newHead = head.next;
      tail.next = newHead;
      setHead(newHead);
    } else {
      const newHead = head.next;
      if (listType === "doubly" && newHead) {
        newHead.prev = null;
      }
      setHead(newHead);
    }

    addToHistory(`Deleted node from beginning`);
  };

  const insertAtPosition = async (value: number, pos: number) => {
    if (pos < 1) {
      addToHistory("Position must be 1 or greater");
      return;
    }

    if (pos === 1) {
      insertAtBeginning(value);
      return;
    }

    const newNode =
      listType === "doubly" ? createDoublyNode(value) : createNode(value);

    if (!head) {
      addToHistory("Cannot insert at position in empty list");
      return;
    }

    let curr: ListNode | null = head;
    let prev: ListNode | null = null;
    let currentPos = 1;

    // Navigate to the position
    while (curr && currentPos < pos) {
      prev = curr;
      curr = curr.next;
      currentPos++;

      // Prevent infinite loop in circular lists
      if (listType === "circular" && curr === head) break;
    }

    if (currentPos < pos) {
      addToHistory(`Position ${pos} is beyond list length`);
      return;
    }

    // Insert the node
    if (prev) {
      prev.next = newNode;
      newNode.next = curr;

      if (listType === "doubly") {
        newNode.prev = prev;
        if (curr) {
          curr.prev = newNode;
        }
      }
    }

    setHead({ ...head });
    addToHistory(`Inserted ${value} at position ${pos}`);
  };

  const deleteAtEnd = async () => {
    if (!head) {
      addToHistory("Cannot delete from empty list");
      return;
    }

    // Single node case
    if (!head.next || (listType === "circular" && head.next === head)) {
      setHead(null);
      addToHistory("Deleted last node from list");
      return;
    }

    if (listType === "circular") {
      // Find the node before the last node
      let curr = head;
      let prev: ListNode | null = null;

      while (curr.next && curr.next !== head) {
        prev = curr;
        curr = curr.next;
      }

      if (prev) {
        prev.next = head;
      }
    } else {
      // Find the second-to-last node
      let curr = head;
      let prev: ListNode | null = null;

      while (curr.next) {
        prev = curr;
        curr = curr.next;
      }

      if (prev) {
        prev.next = null;
        if (listType === "doubly") {
          // No need to update curr.prev since we're deleting curr
        }
      }
    }

    setHead({ ...head });
    addToHistory("Deleted node from end");
  };

  const deleteAtPosition = async (pos: number) => {
    if (pos < 1) {
      addToHistory("Position must be 1 or greater");
      return;
    }

    if (!head) {
      addToHistory("Cannot delete from empty list");
      return;
    }

    if (pos === 1) {
      deleteAtBeginning();
      return;
    }

    let curr: ListNode | null = head;
    let prev: ListNode | null = null;
    let currentPos = 1;

    // Navigate to the position
    while (curr && currentPos < pos) {
      prev = curr;
      curr = curr.next;
      currentPos++;

      // Prevent infinite loop in circular lists
      if (listType === "circular" && curr === head) break;
    }

    if (!curr || currentPos < pos) {
      addToHistory(`Position ${pos} is beyond list length`);
      return;
    }

    // Delete the node
    if (prev) {
      prev.next = curr.next;

      if (listType === "doubly" && curr.next) {
        curr.next.prev = prev;
      }
    }

    setHead({ ...head });
    addToHistory(`Deleted node from position ${pos}`);
  };

  const search = async (value: number) => {
    if (!head) {
      addToHistory("Cannot search in empty list");
      return;
    }

    setCurrentOperation("search")

    let curr: ListNode | null = head
    let position = 1
    let found = false

    do {
      if (!curr) break;

      if (curr.value === value) {
        found = true;
        break;
      }

      curr = curr.next;
      position++;
    } while (curr && (listType !== "circular" || curr !== head));

    if (!found) {
      addToHistory(`Value ${value} not found in the list`);
    } else {
      addToHistory(
        `Searched for value ${value} - found at position ${position}`
      );
    }
  };

  const addToHistory = (operation: string) => {
    setOperationHistory((prev) => [
      `${new Date().toLocaleTimeString()}: ${operation}`,
      ...prev.slice(0, 19),
    ]);
  };

  const getOperationCode = (operation: CodeOperationType | "") => {
    const codes = {
      "insert-beginning": {
        title: "Insert at Beginning",
        steps: [
          "1. Create a new node with the given value",
          "2. Set new node's next pointer to current head",
          "3. Update head to point to new node",
          "4. For doubly linked lists, update prev pointers",
          "5. For circular lists, update tail's next pointer",
        ],
        code: `// Singly Linked List
function insertAtBeginning(value) {
    const newNode = new Node(value);
    newNode.next = head;
    head = newNode;
}

// Doubly Linked List
function insertAtBeginning(value) {
    const newNode = new Node(value);
    newNode.next = head;
    if (head) {
        head.prev = newNode;
    }
    head = newNode;
}

// Circular Linked List
function insertAtBeginning(value) {
    const newNode = new Node(value);
    if (!head) {
        newNode.next = newNode;
        head = newNode;
    } else {
        let tail = head;
        while (tail.next !== head) {
            tail = tail.next;
        }
        newNode.next = head;
        tail.next = newNode;
        head = newNode;
    }
}`,
      },
      "insert-end": {
        title: "Insert at End",
        steps: [
          "1. Create a new node with the given value",
          "2. If list is empty, make new node the head",
          "3. Otherwise, traverse to the last node",
          "4. Set last node's next pointer to new node",
          "5. For doubly linked lists, set new node's prev pointer",
        ],
        code: `// Singly Linked List
function insertAtEnd(value) {
    const newNode = new Node(value);
    if (!head) {
        head = newNode;
        return;
    }
    let current = head;
    while (current.next) {
        current = current.next;
    }
    current.next = newNode;
}

// Doubly Linked List
function insertAtEnd(value) {
    const newNode = new Node(value);
    if (!head) {
        head = newNode;
        return;
    }
    let current = head;
    while (current.next) {
        current = current.next;
    }
    current.next = newNode;
    newNode.prev = current;
}

// Circular Linked List
function insertAtEnd(value) {
    const newNode = new Node(value);
    if (!head) {
        newNode.next = newNode;
        head = newNode;
        return;
    }
    let current = head;
    while (current.next !== head) {
        current = current.next;
    }
    current.next = newNode;
    newNode.next = head;
}`,
      },
      "insert-position": {
        title: "Insert at Position",
        steps: [
          "1. Validate the position (must be >= 1)",
          "2. If position is 1, insert at beginning",
          "3. Create a new node with the given value",
          "4. Traverse to position-1 to find the previous node",
          "5. Update pointers to insert the new node",
          "6. Handle edge cases for different list types",
        ],
        code: `// Singly Linked List
function insertAtPosition(value, position) {
    if (position < 1) return false;
    if (position === 1) {
        insertAtBeginning(value);
        return true;
    }
    
    const newNode = new Node(value);
    let current = head;
    
    // Traverse to position-1
    for (let i = 1; i < position - 1 && current; i++) {
        current = current.next;
    }
    
    if (!current) return false; // Position out of bounds
    
    newNode.next = current.next;
    current.next = newNode;
    return true;
}

// Doubly Linked List
function insertAtPosition(value, position) {
    if (position < 1) return false;
    if (position === 1) {
        insertAtBeginning(value);
        return true;
    }
    
    const newNode = new Node(value);
    let current = head;
    
    for (let i = 1; i < position - 1 && current; i++) {
        current = current.next;
    }
    
    if (!current) return false;
    
    newNode.next = current.next;
    newNode.prev = current;
    if (current.next) {
        current.next.prev = newNode;
    }
    current.next = newNode;
    return true;
}`,
      },
      "delete-beginning": {
        title: "Delete from Beginning",
        steps: [
          "1. Check if list is empty",
          "2. Store reference to current head",
          "3. Update head to point to second node",
          "4. For doubly linked lists, update prev pointer of new head",
          "5. For circular lists, update tail's next pointer",
          "6. Free memory of deleted node",
        ],
        code: `// Singly Linked List
function deleteAtBeginning() {
    if (!head) return null;
    
    const deletedValue = head.value;
    head = head.next;
    return deletedValue;
}

// Doubly Linked List
function deleteAtBeginning() {
    if (!head) return null;
    
    const deletedValue = head.value;
    head = head.next;
    if (head) {
        head.prev = null;
    }
    return deletedValue;
}

// Circular Linked List
function deleteAtBeginning() {
    if (!head) return null;
    
    const deletedValue = head.value;
    
    if (head.next === head) {
        // Only one node
        head = null;
    } else {
        let tail = head;
        while (tail.next !== head) {
            tail = tail.next;
        }
        head = head.next;
        tail.next = head;
    }
    return deletedValue;
}`,
      },
      "delete-end": {
        title: "Delete from End",
        steps: [
          "1. Check if list is empty",
          "2. If only one node, delete it and update head",
          "3. Traverse to second-to-last node",
          "4. Update its next pointer to null",
          "5. For circular lists, update to point to head",
          "6. Free memory of deleted node",
        ],
        code: `// Singly Linked List
function deleteAtEnd() {
    if (!head) return null;
    
    if (!head.next) {
        const deletedValue = head.value;
        head = null;
        return deletedValue;
    }
    
    let current = head;
    while (current.next.next) {
        current = current.next;
    }
    
    const deletedValue = current.next.value;
    current.next = null;
    return deletedValue;
}

// Doubly Linked List
function deleteAtEnd() {
    if (!head) return null;
    
    if (!head.next) {
        const deletedValue = head.value;
        head = null;
        return deletedValue;
    }
    
    let current = head;
    while (current.next) {
        current = current.next;
    }
    
    const deletedValue = current.value;
    current.prev.next = null;
    return deletedValue;
}

// Circular Linked List
function deleteAtEnd() {
    if (!head) return null;
    
    if (head.next === head) {
        const deletedValue = head.value;
        head = null;
        return deletedValue;
    }
    
    let current = head;
    let prev = null;
    
    while (current.next !== head) {
        prev = current;
        current = current.next;
    }
    
    const deletedValue = current.value;
    prev.next = head;
    return deletedValue;
}`,
      },
      "delete-position": {
        title: "Delete from Position",
        steps: [
          "1. Validate the position (must be >= 1)",
          "2. If position is 1, delete from beginning",
          "3. Traverse to position-1 to find previous node",
          "4. Store reference to node to be deleted",
          "5. Update previous node's next pointer",
          "6. For doubly linked lists, update next node's prev pointer",
        ],
        code: `// Singly Linked List
function deleteAtPosition(position) {
    if (position < 1 || !head) return null;
    
    if (position === 1) {
        return deleteAtBeginning();
    }
    
    let current = head;
    
    // Traverse to position-1
    for (let i = 1; i < position - 1 && current; i++) {
        current = current.next;
    }
    
    if (!current || !current.next) return null;
    
    const deletedValue = current.next.value;
    current.next = current.next.next;
    return deletedValue;
}

// Doubly Linked List
function deleteAtPosition(position) {
    if (position < 1 || !head) return null;
    
    if (position === 1) {
        return deleteAtBeginning();
    }
    
    let current = head;
    
    for (let i = 1; i < position && current; i++) {
        current = current.next;
    }
    
    if (!current) return null;
    
    const deletedValue = current.value;
    
    if (current.prev) {
        current.prev.next = current.next;
    }
    if (current.next) {
        current.next.prev = current.prev;
    }
    
    return deletedValue;
}`,
      },
      "search": {
        title: "Search Node",
        steps: [
          "1. Check if list is empty",
          "2. Start from head node",
          "3. Compare current node's value with target",
          "4. If found, return position",
          "5. Move to next node",
          "6. Repeat until target found or end reached",
          "7. Handle circular list to avoid infinite loop",
        ],
        code: `// Singly Linked List
function search(value) {
    if (!head) return -1;
    
    let current = head;
    let position = 1;
    
    while (current) {
        if (current.value === value) {
            return position;
        }
        current = current.next;
        position++;
    }
    
    return -1;
}

// Doubly Linked List
function search(value) {
    if (!head) return -1;
    
    let current = head;
    let position = 1;
    
    while (current) {
        if (current.value === value) {
            return position;
        }
        current = current.next;
        position++;
    }
    
    return -1;
}

// Circular Linked List
function search(value) {
    if (!head) return -1;
    
    let current = head;
    let position = 1;
    
    do {
        if (current.value === value) {
            return position;
        }
        current = current.next;
        position++;
    } while (current && current !== head);
    
    return -1;
}`,
      },
    }

    return (
      codes[operation as CodeOperationType] || {
        title: "",
        steps: [],
        code: "",
      }
    );
  };

  // Add this state near other useState declarations
  const [selectedOperation, setSelectedOperation] = useState<string>("");

  const nodes = toArray()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3 min-h-[110px]">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <List className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Interactive Linked List Visualizer
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Learn linked lists through step-by-step animations
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
                onClick={() => setShowCode(prev => !prev)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Code className="w-5 h-5 md:w-6 md:h-6" />
                <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tutorial Panel */}
        {showTutorial && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">
                {listType === "singly"
                  ? "Singly Linked List"
                  : listType === "doubly"
                  ? "Doubly Linked List"
                  : "Circular Linked List"}
              </h2>
            </div>
            <p className="text-blue-800 mb-4">
              {listType === "singly"
                ? "Each node contains data and a pointer to the next node. The last node points to null."
                : listType === "doubly"
                ? "Each node contains data and pointers to both next and previous nodes."
                : "The last node points back to the first node, forming a circle."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Time Complexity
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Insert/Delete at beginning: O(1), Insert/Delete at end: O(n),
                  Search: O(n)
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    Use Case
                  </span>
                </div>
                <p className="text-sm text-purple-700">
                  {listType === "singly"
                    ? "When you need dynamic size and frequent insertions/deletions at the beginning."
                    : listType === "doubly"
                    ? "When you need bidirectional traversal and frequent insertions/deletions at both ends."
                    : "When you need to cycle through elements repeatedly, like in round-robin scheduling."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* List Type Selector */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Linked List Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["singly", "doubly", "circular"] as ListType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setListType(type);
                  setHead(null);
                  setOperationHistory([]);
                  setNodeCounter(0);
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  listType === type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-lg font-semibold capitalize">
                  {type} Linked List
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {type === "singly" && "→ One-way connections"}
                  {type === "doubly" && "↔ Two-way connections"}
                  {type === "circular" && "↻ Circular connections"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Operations
              </h2>

              {/* Input Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Position"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Value
                  </label>
                  <input
                    type="number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search for value"
                  />
                </div>
              </div>

              {/* Operation Buttons */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Insert Operations
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        const val = Number.parseInt(inputValue);
                        if (!isNaN(val)) {
                          setCurrentOperation("insert-beginning");
                          insertAtBeginning(val);
                          setInputValue("");
                        }
                      }}
                      disabled={!inputValue}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert at Beginning</span>
                    </button>
                    <button
                      onClick={() => {
                        const val = Number.parseInt(inputValue);
                        if (!isNaN(val)) {
                          setCurrentOperation("insert-end");
                          insertAtEnd(val);
                          setInputValue("");
                        }
                      }}
                      disabled={!inputValue}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert at End</span>
                    </button>
                    <button
                      onClick={() => {
                        const val = Number.parseInt(inputValue);
                        if (!isNaN(val) && position >= 1) {
                          setCurrentOperation("insert-position");
                          insertAtPosition(val, position);
                          setInputValue("");
                        }
                      }}
                      disabled={!inputValue || position < 1}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert at Position {position}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Delete Operations
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        setCurrentOperation("delete-beginning");
                        deleteAtBeginning();
                      }}
                      disabled={!head}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                      <span>Delete from Beginning</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentOperation("delete-end");
                        deleteAtEnd();
                      }}
                      disabled={!head}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                      <span>Delete from End</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentOperation("delete-position");
                        deleteAtPosition(position);
                      }}
                      disabled={!head || position < 1}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                      <span>Delete from Position {position}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Other Operations
                  </h3>
                  <button
                    onClick={() => {
                      const val = Number.parseInt(searchTerm);
                      if (!isNaN(val)) {
                        search(val);
                        setSearchTerm("");
                      }
                    }}
                    disabled={!searchTerm || !head}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    <span>Search Value</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {listType.charAt(0).toUpperCase() + listType.slice(1)} Linked
                  List
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Nodes: {nodes.length}</span>
                </div>
              </div>

              {/* List Visualization */}
              <div className="min-h-[200px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 overflow-x-auto">
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <List className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>List is empty. Add some nodes to get started!</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    {nodes.map((node, index) => (
                      <div key={node.id} className="flex items-center">
                        {/* Node */}
                        <div
                          className={`relative px-6 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-500 ${
                            index < nodes.length - 1 && "border-blue-400"
                          }`}
                        >
                          <span>{node.value}</span>
                        </div>

                        {/* Connection line */}
                        {index < nodes.length - 1 && (
                          <div className="w-8 h-0.5 bg-blue-400"></div>
                        )}

                        {/* Circular connection indicator */}
                        {listType === "circular" &&
                          index === nodes.length - 1 && (
                            <div className="flex items-center ml-4">
                              <div className="w-8 h-0.5 bg-green-400"></div>
                              <RotateCcw className="w-6 h-6 text-green-500" />
                              <span className="ml-2 text-sm text-green-700 font-medium">
                                to HEAD
                              </span>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Operation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Operation History
              </h2>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {operationHistory.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No operations performed yet
                  </p>
                ) : (
                  operationHistory.map((operation, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-blue-400"
                    >
                      {operation}
                    </div>
                  ))
                )}
              </div>
            </div>

                          {/* Practice Questions Section - Card Style */}
                          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 p-6 mt-8">
                            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Practice Questions (Linked List)</h2>
                            <ul className="space-y-3">
                              <li>
                                <a href="https://leetcode.com/problems/reverse-linked-list/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Reverse Linked List (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/merge-two-sorted-lists/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Merge Two Sorted Lists (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/linked-list-cycle/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Linked List Cycle (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/add-two-numbers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Add Two Numbers (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://leetcode.com/problems/palindrome-linked-list/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Palindrome Linked List (LeetCode)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/delete-without-head-pointer/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Delete Without Head Pointer (GFG)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Detect Loop in Linked List (GFG)</a>
                              </li>
                              <li>
                                <a href="https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Flattening a Linked List (GFG)</a>
                              </li>
                            </ul>
                          </div>

            {/* Code Implementation Section */}
            {currentOperation && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {
                      getOperationCode(currentOperation as CodeOperationType)
                        .title
                    }{" "}
                    - Implementation
                  </h2>
                  <button
                    onClick={() => setShowStepByStep(!showStepByStep)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    <span>{showStepByStep ? "Hide Steps" : "Show Steps"}</span>
                  </button>
                </div>

                {showStepByStep && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Algorithm Steps:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {getOperationCode(
                        currentOperation as CodeOperationType
                      ).steps.map((step: string, index: number) => (
                        <li key={index} className="text-gray-700">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>
                      {
                        getOperationCode(currentOperation as CodeOperationType)
                          .code
                      }
                    </code>
                  </pre>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Time & Space Complexity:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">
                        Time Complexity:
                      </span>
                      <span className="ml-2 text-blue-600">
                        {currentOperation.includes("position")
                          ? "O(n)"
                          : currentOperation.includes("end") &&
                            !currentOperation.includes("delete-end")
                          ? "O(n)"
                          : "O(1)"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">
                        Space Complexity:
                      </span>
                      <span className="ml-2 text-blue-600">O(1)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCode && (
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded ${
                !selectedOperation ? 'bg-blue-500' : 'bg-gray-700'
              } text-white hover:opacity-90 transition-opacity`}
              onClick={() => setSelectedOperation("")}
            >
              Structure
            </button>
            {Object.keys(getLinkedListCode(listType).operations).map((op) => (
              <button
                key={op}
                className={`px-4 py-2 rounded ${
                  selectedOperation === op ? 'bg-blue-500' : 'bg-gray-700'
                } text-white hover:opacity-90 transition-opacity`}
                onClick={() => setSelectedOperation(op)}
              >
                {op.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-white font-mono text-sm">
              {selectedOperation
                ? getLinkedListCode(listType).operations[selectedOperation]
                : getLinkedListCode(listType).structure}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default LinkedListVisualizerPage;


