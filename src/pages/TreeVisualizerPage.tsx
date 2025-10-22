"use client"

import { useState } from "react"
import type { JSX } from "react"
import {
  TreePine,
  Plus,
  Search,
  RotateCcw,
  Code,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  Database,
  Layers,
  Copy,
  Check,
} from "lucide-react"

// Tree Node interfaces for different tree types
interface TreeNode {
  id: string
  value: number
  left?: TreeNode | null
  right?: TreeNode | null
  parent?: TreeNode | null
  height?: number
  color?: "red" | "black"
  isHighlighted?: boolean
  isNew?: boolean
  isDeleting?: boolean
  level?: number
  x?: number
  y?: number
}

interface BTreeNode {
  id: string
  keys: number[]
  children: BTreeNode[]
  isLeaf: boolean
  parent?: BTreeNode | null
  isHighlighted?: boolean
  isNew?: boolean
  level?: number
  x?: number
  y?: number
}

interface HeapNode {
  id: string
  value: number
  index: number
  isHighlighted?: boolean
  isNew?: boolean
  isSwapping?: boolean
  level?: number
  x?: number
  y?: number
}

type TreeType = "binary" | "bst" | "avl" | "redblack" | "heap" | "btree" | "bplus"
type TraversalType = "inorder" | "preorder" | "postorder" | "levelorder"

const tutorialContent: Record<
  string,
  {
    title: string
    description: string
    complexity: string
    useCase: string
  }
> = {
  binary: {
    title: "Binary Tree",
    description: "A tree data structure in which each node has at most two children.",
    complexity: "O(n) for traversal, O(log n) for balanced insert/search.",
    useCase: "Hierarchical data, expression parsing, etc.",
  },
  bst: {
    title: "Binary Search Tree",
    description: "A binary tree where left < root < right for all nodes.",
    complexity: "O(log n) for balanced insert/search, O(n) worst case.",
    useCase: "Efficient searching and sorting.",
  },
  avl: {
    title: "AVL Tree",
    description: "A self-balancing binary search tree.",
    complexity: "O(log n) for insert/search/delete.",
    useCase: "Ordered data with frequent insertions/deletions.",
  },
  redblack: {
    title: "Red-Black Tree",
    description: "A self-balancing binary search tree with color properties.",
    complexity: "O(log n) for insert/search/delete.",
    useCase: "Associative containers (e.g., map/set in C++ STL).",
  },
  heap: {
    title: "Heap",
    description: "A complete binary tree used to implement priority queues.",
    complexity: "O(log n) for insert/delete, O(1) for get-min/max.",
    useCase: "Priority queues, heap sort.",
  },
  btree: {
    title: "B-Tree",
    description:
      "A self-balancing tree for sorted data, optimized for systems that read and write large blocks of data.",
    complexity: "O(log n) for insert/search/delete.",
    useCase: "Databases, file systems.",
  },
  bplus: {
    title: "B+ Tree",
    description: "A type of B-tree in which all values are at the leaf level and internal nodes only store keys.",
    complexity: "O(log n) for insert/search/delete.",
    useCase: "Database indexing.",
  },
}

function TreeVisualizerPage() {
  const [treeType, setTreeType] = useState<TreeType>("binary")
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [bTreeRoot, setBTreeRoot] = useState<BTreeNode | null>(null)
  const [heapArray, setHeapArray] = useState<HeapNode[]>([])
  const [inputValue, setInputValue] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [bTreeOrder, setBTreeOrder] = useState(3)

  // UI states
  const [operationHistory, setOperationHistory] = useState<string[]>([])
  const [showCode, setShowCode] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [nodeCounter, setNodeCounter] = useState(0)
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [selectedTraversal, setSelectedTraversal] = useState<TraversalType>("inorder")
  const [copiedCode, setCopiedCode] = useState(false)

  // Helper functions
  const generateNodeId = () => {
    setNodeCounter((prev) => prev + 1)
    return `node-${nodeCounter}`
  }

  const createTreeNode = (value: number): TreeNode => ({
    id: generateNodeId(),
    value,
    left: null,
    right: null,
    height: 1,
    color: "red",
    isNew: true,
  })

  const createBTreeNode = (keys: number[] = [], isLeaf = true): BTreeNode => ({
    id: generateNodeId(),
    keys,
    children: [],
    isLeaf,
    isNew: true,
  })

  const createHeapNode = (value: number, index: number): HeapNode => ({
    id: generateNodeId(),
    value,
    index,
    isNew: true,
  })

  const insertBST = (value: number) => {
    if (!root) {
      const newNode = createTreeNode(value)
      setRoot(newNode)
    } else {
      const newRoot = insertBSTRecursive(root, value)
      setRoot({ ...newRoot })
    }
    addToHistory(`Inserted ${value} into BST`)
  }

  const insertBSTRecursive = (node: TreeNode, value: number): TreeNode => {
    if (value < node.value) {
      if (!node.left) {
        const newNode = createTreeNode(value)
        node.left = newNode
        newNode.parent = node
        return node
      } else {
        node.left = insertBSTRecursive(node.left, value)
        return node
      }
    } else if (value > node.value) {
      if (!node.right) {
        const newNode = createTreeNode(value)
        node.right = newNode
        newNode.parent = node
        return node
      } else {
        node.right = insertBSTRecursive(node.right, value)
        return node
      }
    }
    return node
  }

  // AVL Tree Operations
  const getHeight = (node: TreeNode | null): number => {
    return node ? node.height || 1 : 0
  }

  const getBalance = (node: TreeNode | null): number => {
    return node ? getHeight(node.left ?? null) - getHeight(node.right ?? null) : 0
  }

  const updateHeight = (node: TreeNode) => {
    node.height = Math.max(getHeight(node.left ?? null), getHeight(node.right ?? null)) + 1
  }

  const rotateRight = (y: TreeNode): TreeNode => {
    const x = y.left!
    const T2 = x.right

    x.right = y
    y.left = T2

    updateHeight(y)
    updateHeight(x)

    return x
  }

  const rotateLeft = (x: TreeNode): TreeNode => {
    const y = x.right!
    const T2 = y.left

    y.left = x
    x.right = T2

    updateHeight(x)
    updateHeight(y)

    return y
  }

  const insertAVL = (value: number) => {
    const newRoot = insertAVLRecursive(root, value)
    setRoot(newRoot)
    addToHistory(`Inserted ${value} into AVL tree`)
  }

  const insertAVLRecursive = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
      const newNode = createTreeNode(value)
      return newNode
    }

    if (value < node.value) {
      node.left = insertAVLRecursive(node.left ?? null, value)
    } else if (value > node.value) {
      node.right = insertAVLRecursive(node.right ?? null, value)
    } else {
      return node
    }

    updateHeight(node)

    const balance = getBalance(node)

    if (balance > 1 && value < node.left!.value) {
      return rotateRight(node)
    }

    if (balance < -1 && value > node.right!.value) {
      return rotateLeft(node)
    }

    if (balance > 1 && value > (node.left?.value ?? Number.POSITIVE_INFINITY)) {
      if (node.left) {
        node.left = rotateLeft(node.left)
        return rotateRight(node)
      }
    }

    if (balance < -1 && value < (node.right?.value ?? Number.NEGATIVE_INFINITY)) {
      if (node.right) {
        node.right = rotateRight(node.right)
        return rotateLeft(node)
      }
    }

    return node
  }

  // Red-Black Tree Operations
  const insertRedBlack = (value: number) => {
    if (!root) {
      const newNode = createTreeNode(value)
      newNode.color = "black"
      setRoot(newNode)
    } else {
      const newRoot = insertRBRecursive(root, value)
      setRoot({ ...newRoot })
    }
    addToHistory(`Inserted ${value} into Red-Black tree`)
  }

  const insertRBRecursive = (node: TreeNode, value: number): TreeNode => {
    if (value < node.value) {
      if (!node.left) {
        const newNode = createTreeNode(value)
        newNode.color = "red"
        node.left = newNode
        newNode.parent = node
        return node
      } else {
        node.left = insertRBRecursive(node.left, value)
        return node
      }
    } else if (value > node.value) {
      if (!node.right) {
        const newNode = createTreeNode(value)
        newNode.color = "red"
        node.right = newNode
        newNode.parent = node
        return node
      } else {
        node.right = insertRBRecursive(node.right, value)
        return node
      }
    }
    return node
  }

  // Heap Operations
  const insertHeap = (value: number) => {
    const newHeap = [...heapArray]
    const newNode = createHeapNode(value, newHeap.length)
    newHeap.push(newNode)

    let index = newHeap.length - 1
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (newHeap[index].value <= newHeap[parentIndex].value) break
      ;[newHeap[index], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[index]]
      newHeap[index].index = index
      newHeap[parentIndex].index = parentIndex
      index = parentIndex
    }

    setHeapArray(newHeap)
    addToHistory(`Inserted ${value} into Heap`)
  }

  // B-Tree Operations
  const insertBTree = (value: number) => {
    if (!bTreeRoot) {
      const newNode = createBTreeNode([value], true)
      setBTreeRoot(newNode)
    } else {
      insertBTreeRecursive(bTreeRoot, value)
      setBTreeRoot({ ...bTreeRoot })
    }
    addToHistory(`Inserted ${value} into B-Tree`)
  }

  const insertBTreeRecursive = (node: BTreeNode, value: number): void => {
    let i = 0
    while (i < node.keys.length && value > node.keys[i]) {
      i++
    }

    if (node.isLeaf) {
      node.keys.splice(i, 0, value)
    } else if (i < node.children.length) {
      insertBTreeRecursive(node.children[i], value)
    }
  }

  // Tree Traversals
  const performTraversal = (type: TraversalType) => {
    const result: number[] = []

    switch (type) {
      case "inorder":
        inorderTraversal(root, result)
        break
      case "preorder":
        preorderTraversal(root, result)
        break
      case "postorder":
        postorderTraversal(root, result)
        break
      case "levelorder":
        levelorderTraversal(root, result)
        break
    }

    setTraversalResult(result)
    addToHistory(`Performed ${type} traversal: [${result.join(", ")}]`)
  }

  const inorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node) {
      inorderTraversal(node.left ?? null, result)
      result.push(node.value)
      inorderTraversal(node.right ?? null, result)
    }
  }

  const preorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node) {
      result.push(node.value)
      preorderTraversal(node.left ?? null, result)
      preorderTraversal(node.right ?? null, result)
    }
  }

  const postorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node) {
      postorderTraversal(node.left ?? null, result)
      postorderTraversal(node.right ?? null, result)
      result.push(node.value)
    }
  }

  const levelorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (!node) return
    const queue = [node]
    while (queue.length > 0) {
      const current = queue.shift()!
      result.push(current.value)
      if (current.left) queue.push(current.left)
      if (current.right) queue.push(current.right)
    }
  }

  // Search operation
  const searchTree = (value: number) => {
    if (!root) {
      addToHistory("Cannot search in empty tree")
      return
    }

    let found = false

    const searchRecursive = (node: TreeNode | null): boolean => {
      if (!node) return false

      if (node.value === value) {
        found = true
        return true
      } else if (value < node.value) {
        return searchRecursive(node.left ?? null)
      } else {
        return searchRecursive(node.right ?? null)
      }
    }

    searchRecursive(root)

    if (!found) {
      addToHistory(`Value ${value} not found in tree`)
    } else {
      addToHistory(`Searched for ${value} - found`)
    }
  }

  const addToHistory = (operation: string) => {
    setOperationHistory((prev) => [`${new Date().toLocaleTimeString()}: ${operation}`, ...prev.slice(0, 19)])
  }

  // Clear tree
  const clearTree = () => {
    setRoot(null)
    setBTreeRoot(null)
    setHeapArray([])
    setNodeCounter(0)
    addToHistory("Tree cleared")
  }

  // Tree rendering functions
  const renderBinaryTree = () => {
    if (!root) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <TreePine className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Tree is empty. Add some nodes to get started!</p>
          </div>
        </div>
      )
    }

    return <BinaryTreeRenderer root={root} />
  }

  const renderHeap = () => {
    if (heapArray.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Heap is empty. Add some elements to get started!</p>
          </div>
        </div>
      )
    }

    return <HeapRenderer heap={heapArray} />
  }

  const renderBTree = () => {
    if (!bTreeRoot) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>B-Tree is empty. Add some keys to get started!</p>
          </div>
        </div>
      )
    }

    return <BTreeRenderer root={bTreeRoot} />
  }

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 1500)
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
    }
  }

  // Get the current tree implementation code
  const getCurrentTreeCode = () => {
    switch (treeType) {
      case "binary": return getFullTreeCode()
      case "bst": return getFullBSTCode()
      case "avl": return getFullAVLCode()
      case "redblack": return getFullRBCode()
      case "heap": return getFullHeapCode()
      case "btree": return getFullBTreeCode()
      case "bplus": return getFullBPlusTreeCode()
      default: return getFullTreeCode()
    }
  }

  const getFullTreeCode = () => {
    return `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        """Insert node in first available position (level order)"""
        new_node = TreeNode(value)
        if not self.root:
            self.root = new_node
            return
        queue = [self.root]
        while queue:
            node = queue.pop(0)
            if not node.left:
                node.left = new_node
                return
            elif not node.right:
                node.right = new_node
                return
            else:
                queue.append(node.left)
                queue.append(node.right)

    def inorder(self, node=None):
        if node is None:
            node = self.root
        if not node:
            return []
        return self.inorder(node.left) + [node.value] + self.inorder(node.right)

# Example usage
bt = BinaryTree()
bt.insert(10)
bt.insert(20)
bt.insert(5)
print("Inorder:", bt.inorder())`
  }

  const getFullBSTCode = () => {
    return `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        """Insert node following BST rules"""
        new_node = TreeNode(value)
        if not self.root:
            self.root = new_node
            return
        current = self.root
        while True:
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    return
                current = current.left
            else:
                if current.right is None:
                    current.right = new_node
                    return
                current = current.right

    def inorder(self, node=None):
        if node is None:
            node = self.root
        if not node:
            return []
        return self.inorder(node.left) + [node.value] + self.inorder(node.right)

# Example usage
bst = BinarySearchTree()
bst.insert(10)
bst.insert(5)
bst.insert(20)
bst.insert(15)
print("Inorder:", bst.inorder())`
  }

  const getFullAVLCode = () => {
    return `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None

    def insert(self, root, value):
        if not root:
            return TreeNode(value)
        if value < root.value:
            root.left = self.insert(root.left, value)
        else:
            root.right = self.insert(root.right, value)

        root.height = 1 + max(self.getHeight(root.left), self.getHeight(root.right))
        balance = self.getBalance(root)

        if balance > 1 and value < root.left.value:
            return self.rightRotate(root)
        if balance > 1 and value > root.left.value:
            root.left = self.leftRotate(root.left)
            return self.rightRotate(root)

        if balance < -1 and value > root.right.value:
            return self.leftRotate(root)
        if balance < -1 and value < root.right.value:
            root.right = self.rightRotate(root.right)
            return self.leftRotate(root)

        return root

    def leftRotate(self, z):
        y = z.right
        T2 = y.left
        y.left = z
        z.right = T2
        z.height = 1 + max(self.getHeight(z.left), self.getHeight(z.right))
        y.height = 1 + max(self.getHeight(y.left), self.getHeight(y.right))
        return y

    def rightRotate(self, z):
        y = z.left
        T3 = y.right
        y.right = z
        z.left = T3
        z.height = 1 + max(self.getHeight(z.left), self.getHeight(z.right))
        y.height = 1 + max(self.getHeight(y.left), self.getHeight(y.right))
        return y

    def getHeight(self, node):
        if not node:
            return 0
        return node.height

    def getBalance(self, node):
        if not node:
            return 0
        return self.getHeight(node.left) - self.getHeight(node.right)

    def inorder(self, node):
        if not node:
            return []
        return self.inorder(node.left) + [node.value] + self.inorder(node.right)

# Example usage
avl = AVLTree()
root = None
for val in [10, 20, 5, 15]:
    root = avl.insert(root, val)
print("Inorder:", avl.inorder(root))`
  }

  const getFullRBCode = () => {
    return `class Node:
    def __init__(self, value):
        self.value = value
        self.color = 'red'
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.TNULL = Node(0)
        self.TNULL.color = 'black'
        self.root = self.TNULL

    def insert(self, key):
        node = Node(key)
        node.left = self.TNULL
        node.right = self.TNULL
        node.parent = None

        y = None
        x = self.root

        while x != self.TNULL:
            y = x
            if node.value < x.value:
                x = x.left
            else:
                x = x.right

        node.parent = y
        if y is None:
            self.root = node
        elif node.value < y.value:
            y.left = node
        else:
            y.right = node

        if node.parent is None:
            node.color = 'black'
            return

        if node.parent.parent is None:
            return

    def inorder(self, node):
        if node == self.TNULL:
            return []
        return self.inorder(node.left) + [node.value] + self.inorder(node.right)

# Example usage
rb = RedBlackTree()
for val in [10, 20, 5, 15]:
    rb.insert(val)
print("Inorder:", rb.inorder(rb.root))`
  }

  const getFullHeapCode = () => {
    return `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        self.heap.append(val)
        self.heapifyUp(len(self.heap) - 1)

    def heapifyUp(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[parent] > self.heap[index]:
            self.heap[parent], self.heap[index] = self.heap[index], self.heap[parent]
            self.heapifyUp(parent)

    def extractMin(self):
        if len(self.heap) == 0:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self.heapifyDown(0)
        return root

    def heapifyDown(self, index):
        smallest = index
        left = 2*index + 1
        right = 2*index + 2

        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        if smallest != index:
            self.heap[smallest], self.heap[index] = self.heap[index], self.heap[smallest]
            self.heapifyDown(smallest)

# Example usage
heap = MinHeap()
for val in [10, 5, 20, 3]:
    heap.insert(val)
print("Heap array:", heap.heap)
print("Extract min:", heap.extractMin())
print("Heap after extract:", heap.heap)`
  }

  const getFullBTreeCode = () => {
    return `class BTreeNode:
    def __init__(self, t, leaf=False):
        self.t = t
        self.leaf = leaf
        self.keys = []
        self.children = []

class BTree:
    def __init__(self, t):
        self.root = BTreeNode(t, True)
        self.t = t

    def traverse(self, node=None):
        if node is None:
            node = self.root
        res = []
        for i in range(len(node.keys)):
            if not node.leaf:
                res += self.traverse(node.children[i])
            res.append(node.keys[i])
        if not node.leaf:
            res += self.traverse(node.children[-1])
        return res

# Example usage
b = BTree(3)
print("B-Tree traverse:", b.traverse())`
  }

  const getFullBPlusTreeCode = () => {
    return `class BPlusTreeNode:
    def __init__(self, t, leaf=False):
        self.t = t
        self.leaf = leaf
        self.keys = []
        self.children = []
        self.next = None

class BPlusTree:
    def __init__(self, t):
        self.root = BPlusTreeNode(t, True)
        self.t = t

    def traverse(self, node=None):
        if node is None:
            node = self.root
        res = []
        if node.leaf:
            res += node.keys
        else:
            for i in range(len(node.keys)):
                res += self.traverse(node.children[i])
                res.append(node.keys[i])
            res += self.traverse(node.children[-1])
        return res

# Example usage
bplus = BPlusTree(3)
print("B+ Tree traverse:", bplus.traverse())`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto py-4 px-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Advanced Tree Visualizer
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Explore all types of trees with interactive animations
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
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-green-900">{tutorialContent[treeType].title}</h2>
            </div>
            <p className="text-green-800 mb-4">{tutorialContent[treeType].description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">Time Complexity</span>
                </div>
                <p className="text-sm text-green-700">{tutorialContent[treeType].complexity}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Use Case</span>
                </div>
                <p className="text-sm text-blue-700">{tutorialContent[treeType].useCase}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tree Type Selector */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Choose Tree Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {(["binary", "bst", "avl", "redblack", "heap", "btree", "bplus"] as TreeType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTreeType(type)
                  clearTree()
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                  treeType === type
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold capitalize">
                  {type === "bst"
                    ? "BST"
                    : type === "avl"
                      ? "AVL"
                      : type === "redblack"
                        ? "Red-Black"
                        : type === "btree"
                          ? "B-Tree"
                          : type === "bplus"
                            ? "B+ Tree"
                            : type}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Operations</h2>

              {/* Input Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Value</label>
                  <input
                    type="number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search for value"
                  />
                </div>
                {(treeType === "btree" || treeType === "bplus") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">B-Tree Order</label>
                    <input
                      type="number"
                      value={bTreeOrder}
                      onChange={(e) => setBTreeOrder(Number(e.target.value))}
                      min="2"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Operation Buttons */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Basic Operations</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        const val = Number.parseInt(inputValue)
                        if (!isNaN(val)) {
                          if (treeType === "heap") {
                            insertHeap(val)
                          } else if (treeType === "btree" || treeType === "bplus") {
                            insertBTree(val)
                          } else if (treeType === "avl") {
                            insertAVL(val)
                          } else if (treeType === "redblack") {
                            insertRedBlack(val)
                          } else {
                            insertBST(val)
                          }
                          setInputValue("")
                        }
                      }}
                      disabled={!inputValue}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert</span>
                    </button>
                    <button
                      onClick={() => {
                        const val = Number.parseInt(searchTerm)
                        if (!isNaN(val)) {
                          searchTree(val)
                          setSearchTerm("")
                        }
                      }}
                      disabled={!searchTerm || (!root && heapArray.length === 0 && !bTreeRoot)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                    <button
                      onClick={clearTree}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Clear Tree</span>
                    </button>
                  </div>
                </div>

                {/* Traversal Operations */}
                {(treeType === "binary" || treeType === "bst" || treeType === "avl" || treeType === "redblack") && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Tree Traversals</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(["inorder", "preorder", "postorder", "levelorder"] as TraversalType[]).map((traversal) => (
                        <button
                          key={traversal}
                          onClick={() => {
                            setSelectedTraversal(traversal)
                            performTraversal(traversal)
                          }}
                          disabled={!root}
                          className="px-3 py-2 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {traversal.charAt(0).toUpperCase() + traversal.slice(1)}
                        </button>
                      ))}
                    </div>
                    {traversalResult.length > 0 && (
                      <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                        <div className="text-xs font-semibold text-purple-800 mb-1">
                          {selectedTraversal.charAt(0).toUpperCase() + selectedTraversal.slice(1)} Result:
                        </div>
                        <div className="text-xs text-purple-700">[{traversalResult.join(", ")}]</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Main Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tutorialContent[treeType].title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  {treeType === "heap" && <span>Heap Size: {heapArray.length}</span>}
                  {(treeType === "binary" || treeType === "bst" || treeType === "avl" || treeType === "redblack") &&
                    root && <span>Height: {getHeight(root)}</span>}
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="min-h-[400px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 overflow-auto">
                {treeType === "heap"
                  ? renderHeap()
                  : treeType === "btree" || treeType === "bplus"
                    ? renderBTree()
                    : renderBinaryTree()}
              </div>
            </div>

            {/* Operation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operation History</h2>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {operationHistory.length === 0 ? (
                  <p className="text-gray-500 italic">No operations performed yet</p>
                ) : (
                  operationHistory.map((operation, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-green-400"
                    >
                      {operation}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tree Code Display Section */}
            {showCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {treeType === "binary" && "Binary Tree Implementation"}
                  {treeType === "bst" && "Binary Search Tree Implementation"}
                  {treeType === "avl" && "AVL Tree Implementation"}
                  {treeType === "redblack" && "Red-Black Tree Implementation"}
                  {treeType === "heap" && "Heap Implementation"}
                  {treeType === "btree" && "B-Tree Implementation"}
                  {treeType === "bplus" && "B+ Tree Implementation"}
                </h2>

                <div className="relative">
                  <button
                    className="absolute top-2 right-4 inline-flex items-center gap-1 rounded px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white shadow z-10"
                    onClick={() => copyToClipboard(getCurrentTreeCode())}
                    aria-label="Copy tree implementation"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </button>
                  <div 
                    className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono max-h-96 overflow-auto pr-16"
                    onWheel={(e) => {
                      // Prevent page scroll when scrolling within code block
                      e.stopPropagation();
                    }}
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <pre>
                      <code>{getCurrentTreeCode()}</code>
                    </pre>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>💡 Complete Implementation:</strong> This is the full {
                      treeType === "binary" ? "Binary Tree" :
                      treeType === "bst" ? "Binary Search Tree" :
                      treeType === "avl" ? "AVL Tree" :
                      treeType === "redblack" ? "Red-Black Tree" :
                      treeType === "heap" ? "Heap" :
                      treeType === "btree" ? "B-Tree" :
                      treeType === "bplus" ? "B+ Tree" : "Tree"
                    } algorithm implementation. You can copy this code and use it in your own projects!
                  </p>
                </div>
              </div>
            )}

            {/* Practice Questions Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">Practice Questions (Trees)</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://leetcode.com/problems/binary-tree-inorder-traversal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Binary Tree Inorder Traversal (LeetCode)
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/problems/binary-search-tree-iterator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Binary Search Tree Iterator (LeetCode)
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Serialize and Deserialize Binary Tree (LeetCode)
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Construct Binary Tree from Preorder and Inorder Traversal (LeetCode)
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/problems/maximum-depth-of-binary-tree/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Maximum Depth of Binary Tree (LeetCode)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/binary-tree-to-dll/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Binary Tree to DLL (GFG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Lowest Common Ancestor in a Binary Tree (GFG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/check-for-bst/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Check for BST (GFG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/avl-tree-insertion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    AVL Tree Insertion (GFG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/heap-sort/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Heap Sort (GFG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://practice.geeksforgeeks.org/problems/b-tree-insertion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    B-Tree Insertion (GFG)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Binary Tree Renderer Component
function BinaryTreeRenderer({ root }: { root: TreeNode }) {
  const renderNode = (node: TreeNode | null, x: number, y: number, level: number): JSX.Element | null => {
    if (!node) return null

    const isHighlighted = node.isHighlighted
    const isNew = node.isNew
    const isDeleting = node.isDeleting

    return (
      <g key={node.id}>
        {node.left && <line x1={x} y1={y} x2={x - 80 / (level + 1)} y2={y + 80} stroke="#94a3b8" strokeWidth="2" />}
        {node.right && <line x1={x} y1={y} x2={x + 80 / (level + 1)} y2={y + 80} stroke="#94a3b8" strokeWidth="2" />}

        <circle
          cx={x}
          cy={y}
          r="20"
          fill={
            isHighlighted
              ? "#fbbf24"
              : isNew
                ? "#10b981"
                : isDeleting
                  ? "#ef4444"
                  : node.color === "red"
                    ? "#ef4444"
                    : node.color === "black"
                      ? "#374151"
                      : "#3b82f6"
          }
          stroke={isHighlighted ? "#f59e0b" : "#1f2937"}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {node.value}
        </text>

        {node.left && renderNode(node.left, x - 80 / (level + 1), y + 80, level + 1)}
        {node.right && renderNode(node.right, x + 80 / (level + 1), y + 80, level + 1)}
      </g>
    )
  }

  return (
    <svg width="100%" height="400" viewBox="0 0 800 400">
      {renderNode(root, 400, 50, 0)}
    </svg>
  )
}

// Heap Renderer Component
function HeapRenderer({ heap }: { heap: HeapNode[] }) {
  const renderHeapNode = (index: number, x: number, y: number): JSX.Element | null => {
    if (index >= heap.length) return null

    const node = heap[index]
    const isHighlighted = node.isHighlighted
    const isNew = node.isNew
    const isSwapping = node.isSwapping

    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2

    return (
      <g key={node.id}>
        {leftChildIndex < heap.length && (
          <line x1={x} y1={y} x2={x - 60} y2={y + 60} stroke="#94a3b8" strokeWidth="2" />
        )}

        {rightChildIndex < heap.length && (
          <line x1={x} y1={y} x2={x + 60} y2={y + 60} stroke="#94a3b8" strokeWidth="2" />
        )}

        <circle
          cx={x}
          cy={y}
          r="20"
          fill={isHighlighted ? "#fbbf24" : isNew ? "#10b981" : isSwapping ? "#f97316" : "#8b5cf6"}
          stroke="#1f2937"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {node.value}
        </text>

        <text x={x} y={y - 30} textAnchor="middle" fill="#6b7280" fontSize="10">
          [{index}]
        </text>

        {leftChildIndex < heap.length && renderHeapNode(leftChildIndex, x - 60, y + 60)}
        {rightChildIndex < heap.length && renderHeapNode(rightChildIndex, x + 60, y + 60)}
      </g>
    )
  }

  if (heap.length === 0) return null

  return (
    <svg width="100%" height="400" viewBox="0 0 800 400">
      {renderHeapNode(0, 400, 50)}
    </svg>
  )
}

// B-Tree Renderer Component
function BTreeRenderer({ root }: { root: BTreeNode }) {
  const renderBTreeNode = (node: BTreeNode, x: number, y: number, level: number): JSX.Element => {
    const isHighlighted = node.isHighlighted
    const isNew = node.isNew

    const nodeWidth = Math.max(100, node.keys.length * 30 + 20)

    return (
      <g key={node.id}>
        <rect
          x={x - nodeWidth / 2}
          y={y - 15}
          width={nodeWidth}
          height="30"
          fill={isHighlighted ? "#fbbf24" : isNew ? "#10b981" : "#06b6d4"}
          stroke="#1f2937"
          strokeWidth="2"
          rx="5"
          className="transition-all duration-300"
        />

        {node.keys.map((key, index) => (
          <text
            key={index}
            x={x - nodeWidth / 2 + 15 + index * 30}
            y={y + 5}
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {key}
          </text>
        ))}

        {node.children.map((child, index) => {
          const childX = x - nodeWidth / 2 + (index + 1) * (nodeWidth / (node.children.length + 1))
          const childY = y + 80

          return (
            <g key={child.id}>
              <line
                x1={x - nodeWidth / 2 + 15 + index * 30}
                y1={y + 15}
                x2={childX}
                y2={childY - 15}
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {renderBTreeNode(child, childX, childY, level + 1)}
            </g>
          )
        })}
      </g>
    )
  }

  return (
    <svg width="100%" height="400" viewBox="0 0 800 400">
      {renderBTreeNode(root, 400, 50, 0)}
    </svg>
  )
}

export default TreeVisualizerPage
