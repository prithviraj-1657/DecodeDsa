// Dynamic AI Service for handling ANY DSA question
export interface AIResponse {
  text: string;
  code?: string;
  examples?: string[];
  complexity?: {
    time: string;
    space: string;
  };
  relatedTopics?: string[];
  sources?: string[];
}

export interface ConversationContext {
  previousMessages: string[];
  currentTopic?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1/chat/completions';
  
  //constructor() {
    // Use the provided API key by default
   // this.apiKey = "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";
 // }

  // Main method to get AI response for ANY DSA question
  async getResponse(query: string, context?: ConversationContext): Promise<AIResponse> {
    // For now, use comprehensive local responses due to CORS issues
    // TODO: Implement proxy server for OpenAI API calls
    console.log('Getting response for query:', query);
    return this.getComprehensiveLocalResponse(query, context);
    
    // Uncomment when CORS is resolved:
    // try {
    //   return await this.getOpenAIResponse(query, context);
    // } catch (error) {
    //   console.error('AI Service Error:', error);
    //   return this.getFallbackResponse(query);
    // }
  }

  // OpenAI API integration for comprehensive DSA responses
  private async getOpenAIResponse(query: string, context?: ConversationContext): Promise<AIResponse> {
    console.log('Making OpenAI API call for query:', query);
    
    const systemPrompt = `You are an expert Data Structures and Algorithms tutor with deep knowledge of computer science. Your role is to:

1. Provide comprehensive, accurate explanations for ANY DSA question
2. Include practical code examples in JavaScript/TypeScript when relevant
3. Analyze time and space complexity
4. Provide real-world applications and examples
5. Suggest related topics for deeper learning
6. Adapt explanations to the user's level (beginner/intermediate/advanced)

Guidelines:
- Always provide step-by-step explanations
- Include working code examples with comments
- Mention time/space complexity with Big O notation
- Give practical examples of where the concept is used
- Be encouraging and educational
- If the question is unclear, ask for clarification
- Cover edge cases and important considerations

Current conversation context: ${context?.currentTopic ? `Topic: ${context.currentTopic}` : 'General DSA discussion'}
User level: ${context?.userLevel || 'beginner'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(context?.previousMessages.slice(-6).map(msg => ({ role: 'user', content: msg })) || []),
      { role: 'user', content: query }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Changed to gpt-3.5-turbo for better compatibility
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`OpenAI API Error: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }
      
      const content = data.choices[0].message.content;
      console.log('AI Response content:', content);
      
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('Detailed API Error:', error);
      throw error;
    }
  }

  // Web search fallback for comprehensive DSA information
  private async getWebSearchResponse(query: string): Promise<AIResponse> {
    try {
      // Use a web search API to get comprehensive DSA information
      const searchQuery = `data structures algorithms ${query} tutorial examples code`;
      const searchResults = await this.performWebSearch(searchQuery);
      
      if (searchResults && searchResults.length > 0) {
        return this.processSearchResults(query, searchResults);
      }
    } catch (error) {
      console.error('Web search error:', error);
    }
    
    return this.getGenericHelpfulResponse(query);
  }

  // Perform web search (using a search API)
  private async performWebSearch(query: string): Promise<any[]> {
    // Note: In a real implementation, you would use a search API like:
    // - Google Custom Search API
    // - Bing Search API
    // - DuckDuckGo API
    // - SerpAPI
    
    // For now, we'll simulate this with educational DSA resources
    const educationalResources = [
      {
        title: "GeeksforGeeks - " + query,
        url: "https://www.geeksforgeeks.org",
        snippet: `Comprehensive tutorial on ${query} with examples and implementations.`
      },
      {
        title: "LeetCode - " + query,
        url: "https://leetcode.com",
        snippet: `Practice problems and solutions related to ${query}.`
      },
      {
        title: "Coursera - " + query,
        url: "https://www.coursera.org",
        snippet: `Online course covering ${query} concepts and applications.`
      }
    ];
    
    return educationalResources;
  }

  // Process search results into AI response format
  private processSearchResults(query: string, results: any[]): AIResponse {
    const sources = results.map(r => r.url);
    
    return {
      text: `I found comprehensive resources about "${query}". Here's what I can tell you:

${this.generateComprehensiveExplanation(query)}

**Key Points:**
- This is a fundamental concept in computer science
- Understanding this will help you solve many programming problems
- Practice is essential for mastery

**Recommended Resources:**
${results.map((r, i) => `${i + 1}. [${r.title}](${r.url})`).join('\n')}

Would you like me to explain any specific aspect in more detail?`,
      sources,
      relatedTopics: this.getRelatedTopics(query)
    };
  }

  // Generate comprehensive explanation based on query
  private generateComprehensiveExplanation(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('sort') || lowerQuery.includes('sorting')) {
      return `Sorting algorithms are fundamental in computer science. They arrange data in a particular order (ascending or descending). Common sorting algorithms include:

- **Bubble Sort**: Simple but inefficient O(n²)
- **Quick Sort**: Efficient average case O(n log n)
- **Merge Sort**: Stable sorting with O(n log n)
- **Heap Sort**: In-place sorting with O(n log n)
- **Radix Sort**: Non-comparative sorting for integers

Each has different trade-offs in terms of time complexity, space complexity, and stability.`;
    }
    
    if (lowerQuery.includes('search') || lowerQuery.includes('searching')) {
      return `Search algorithms help find specific elements in data structures:

- **Linear Search**: O(n) time, works on any data
- **Binary Search**: O(log n) time, requires sorted data
- **Hash Table Search**: O(1) average case
- **Tree Search**: O(log n) for balanced trees

The choice depends on your data structure and requirements.`;
    }
    
    if (lowerQuery.includes('tree') || lowerQuery.includes('binary tree')) {
      return `Trees are hierarchical data structures with nodes connected by edges:

- **Binary Tree**: Each node has at most 2 children
- **Binary Search Tree**: Left child < parent < right child
- **AVL Tree**: Self-balancing binary search tree
- **Red-Black Tree**: Another self-balancing tree
- **B-Tree**: Multi-way tree for databases

Trees are used for hierarchical data, searching, and sorting.`;
    }
    
    if (lowerQuery.includes('graph')) {
      return `Graphs represent relationships between entities:

- **Directed Graph**: Edges have direction
- **Undirected Graph**: Bidirectional edges
- **Weighted Graph**: Edges have weights
- **Acyclic Graph**: No cycles
- **Connected Graph**: All nodes reachable

Common algorithms: DFS, BFS, Dijkstra's shortest path, topological sorting.`;
    }
    
    if (lowerQuery.includes('dynamic programming') || lowerQuery.includes('dp')) {
      return `Dynamic Programming solves complex problems by breaking them into simpler subproblems:

- **Memoization**: Top-down approach with caching
- **Tabulation**: Bottom-up approach with tables
- **Optimal Substructure**: Optimal solution contains optimal subproblem solutions
- **Overlapping Subproblems**: Same subproblems solved multiple times

Common DP problems: Fibonacci, knapsack, longest common subsequence, edit distance.`;
    }
    
    if (lowerQuery.includes('complexity') || lowerQuery.includes('big o')) {
      return `Algorithm complexity analysis helps compare algorithm efficiency:

- **Time Complexity**: How runtime grows with input size
- **Space Complexity**: How memory usage grows with input size
- **Big O Notation**: Worst-case upper bound
- **Big Ω (Omega)**: Best-case lower bound
- **Big Θ (Theta)**: Tight bound

Common complexities: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).`;
    }
    
    // Generic response for any DSA topic
    return `"${query}" is an important concept in Data Structures and Algorithms. Here's a comprehensive overview:

**What it is:** This concept is fundamental to computer science and programming.

**Why it matters:** Understanding this will help you:
- Write more efficient code
- Solve complex programming problems
- Excel in technical interviews
- Build scalable applications

**Key concepts to understand:**
- Core principles and mechanics
- Time and space complexity
- Implementation details
- Real-world applications
- Common variations and edge cases

**How to learn:**
1. Study the theory and concepts
2. Implement examples step by step
3. Practice with problems
4. Analyze time/space complexity
5. Apply to real projects

Would you like me to dive deeper into any specific aspect?`;
  }

  // Get related topics based on query
  private getRelatedTopics(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('sort')) {
      return ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Time Complexity', 'Stability'];
    }
    if (lowerQuery.includes('search')) {
      return ['Binary Search', 'Hash Tables', 'Linear Search', 'Search Trees'];
    }
    if (lowerQuery.includes('tree')) {
      return ['Binary Search Tree', 'AVL Tree', 'Tree Traversal', 'Balanced Trees'];
    }
    if (lowerQuery.includes('graph')) {
      return ['DFS', 'BFS', 'Shortest Path', 'Topological Sort'];
    }
    if (lowerQuery.includes('dynamic programming')) {
      return ['Memoization', 'Tabulation', 'Knapsack Problem', 'Longest Common Subsequence'];
    }
    
    return ['Time Complexity', 'Space Complexity', 'Implementation', 'Applications'];
  }

  // Parse AI response to extract structured information
  private parseAIResponse(content: string): AIResponse {
    // Extract code blocks
    const codeMatch = content.match(/```(?:javascript|js|typescript|ts)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : undefined;
    
    // Extract complexity information
    const complexityMatch = content.match(/time complexity[:\s]*([^\n]+)/i);
    const spaceMatch = content.match(/space complexity[:\s]*([^\n]+)/i);
    const complexity = complexityMatch || spaceMatch ? {
      time: complexityMatch ? complexityMatch[1].trim() : 'Not specified',
      space: spaceMatch ? spaceMatch[1].trim() : 'Not specified'
    } : undefined;
    
    // Extract examples
    const examples: string[] = [];
    const exampleMatches = content.match(/- ([^\n]+)/g);
    if (exampleMatches) {
      examples.push(...exampleMatches.map(match => match.replace('- ', '')));
    }
    
    // Extract related topics
    const relatedTopics: string[] = [];
    const topicMatches = content.match(/\*\*([^*]+)\*\*/g);
    if (topicMatches) {
      relatedTopics.push(...topicMatches.map(match => match.replace(/\*\*/g, '')));
    }
    
    return {
      text: content,
      code,
      complexity,
      examples: examples.length > 0 ? examples : undefined,
      relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined
    };
  }

  // Comprehensive local response system for DSA questions
  private getComprehensiveLocalResponse(query: string, context?: ConversationContext): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    // Sorting Algorithms
    if (lowerQuery.includes('bubble sort') && lowerQuery.includes('shell sort')) {
      return this.getBubbleVsShellSortResponse();
    }
    if (lowerQuery.includes('quick sort') && lowerQuery.includes('merge sort')) {
      return this.getQuickVsMergeSortResponse();
    }
    if (lowerQuery.includes('bubble sort')) {
      return this.getBubbleSortResponse();
    }
    if (lowerQuery.includes('quick sort')) {
      return this.getQuickSortResponse();
    }
    if (lowerQuery.includes('merge sort')) {
      return this.getMergeSortResponse();
    }
    if (lowerQuery.includes('heap sort')) {
      return this.getHeapSortResponse();
    }
    if (lowerQuery.includes('insertion sort')) {
      return this.getInsertionSortResponse();
    }
    if (lowerQuery.includes('selection sort')) {
      return this.getSelectionSortResponse();
    }
    
    // Searching Algorithms
    if (lowerQuery.includes('binary search')) {
      return this.getBinarySearchResponse();
    }
    if (lowerQuery.includes('linear search')) {
      return this.getLinearSearchResponse();
    }
    
    // Data Structures
    if (lowerQuery.includes('linked list')) {
      return this.getLinkedListResponse();
    }
    if (lowerQuery.includes('stack')) {
      return this.getStackResponse();
    }
    if (lowerQuery.includes('queue')) {
      return this.getQueueResponse();
    }
    if (lowerQuery.includes('binary tree')) {
      return this.getBinaryTreeResponse();
    }
    if (lowerQuery.includes('graph')) {
      return this.getGraphResponse();
    }
    
    // Algorithm Techniques
    if (lowerQuery.includes('dynamic programming') || lowerQuery.includes('dp')) {
      return this.getDynamicProgrammingResponse();
    }
    if (lowerQuery.includes('two pointer')) {
      return this.getTwoPointerResponse();
    }
    if (lowerQuery.includes('sliding window')) {
      return this.getSlidingWindowResponse();
    }
    if (lowerQuery.includes('dfs') || lowerQuery.includes('depth first search')) {
      return this.getDFSResponse();
    }
    if (lowerQuery.includes('bfs') || lowerQuery.includes('breadth first search')) {
      return this.getBFSResponse();
    }
    
    // Complexity Analysis
    if (lowerQuery.includes('big o') || lowerQuery.includes('complexity')) {
      return this.getComplexityAnalysisResponse();
    }
    
    // Generic helpful response
    return this.getGenericHelpfulResponse(query);
  }

  // Bubble Sort vs Shell Sort comparison
  private getBubbleVsShellSortResponse(): AIResponse {
    return {
      text: `Great question! Let me explain the key differences between Bubble Sort and Shell Sort:

## **Bubble Sort**
- **How it works**: Compares adjacent elements and swaps them if they're in wrong order
- **Time Complexity**: O(n²) in all cases
- **Space Complexity**: O(1)
- **Stability**: Stable
- **Best for**: Educational purposes, very small datasets

## **Shell Sort**
- **How it works**: Uses insertion sort on elements that are far apart, then reduces the gap
- **Time Complexity**: O(n log n) to O(n²) depending on gap sequence
- **Space Complexity**: O(1)
- **Stability**: Not stable
- **Best for**: Medium-sized datasets, better performance than bubble sort

## **Key Differences**
1. **Performance**: Shell sort is significantly faster than bubble sort
2. **Algorithm**: Shell sort uses insertion sort with gaps, bubble sort uses simple swaps
3. **Stability**: Bubble sort maintains relative order, shell sort doesn't
4. **Practical use**: Shell sort is more practical for real applications

**When to use which:**
- Use **Bubble Sort** only for learning or very small datasets (< 10 elements)
- Use **Shell Sort** for medium datasets where you need better performance than O(n²)`,
      code: `// Bubble Sort
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Shell Sort
function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}`,
      complexity: {
        time: "Bubble: O(n²), Shell: O(n log n) to O(n²)",
        space: "Both: O(1)"
      },
      examples: [
        "Bubble sort: Educational purposes, very small datasets",
        "Shell sort: Medium datasets, better performance needed"
      ],
      relatedTopics: ['Insertion Sort', 'Quick Sort', 'Merge Sort', 'Time Complexity Analysis']
    };
  }

  // Generic helpful response for unknown questions
  private getGenericHelpfulResponse(query: string): AIResponse {
    return {
      text: `I'd be happy to help with "${query}"! While I'm working on expanding my knowledge base, here are some popular DSA topics I can explain in detail:

**Sorting Algorithms:**
- Bubble Sort, Quick Sort, Merge Sort, Heap Sort
- Insertion Sort, Selection Sort, Shell Sort

**Searching Algorithms:**
- Binary Search, Linear Search, Hash Table Search

**Data Structures:**
- Linked Lists, Stacks, Queues, Trees, Graphs
- Arrays, Hash Tables, Heaps

**Algorithm Techniques:**
- Dynamic Programming, Two Pointers, Sliding Window
- DFS, BFS, Greedy Algorithms

**Complexity Analysis:**
- Big O Notation, Time/Space Complexity

Try asking about any of these topics, or rephrase your question to be more specific!`,
      relatedTopics: ['Sorting Algorithms', 'Searching Algorithms', 'Data Structures', 'Complexity Analysis', 'Dynamic Programming']
    };
  }

  // Placeholder methods for other responses (to be implemented)
  private getQuickVsMergeSortResponse(): AIResponse { return this.getGenericHelpfulResponse("quick sort vs merge sort"); }
  private getBubbleSortResponse(): AIResponse { return this.getGenericHelpfulResponse("bubble sort"); }
  private getQuickSortResponse(): AIResponse { return this.getGenericHelpfulResponse("quick sort"); }
  private getMergeSortResponse(): AIResponse { return this.getGenericHelpfulResponse("merge sort"); }
  private getHeapSortResponse(): AIResponse { return this.getGenericHelpfulResponse("heap sort"); }
  private getInsertionSortResponse(): AIResponse { return this.getGenericHelpfulResponse("insertion sort"); }
  private getSelectionSortResponse(): AIResponse { return this.getGenericHelpfulResponse("selection sort"); }
  private getBinarySearchResponse(): AIResponse { return this.getGenericHelpfulResponse("binary search"); }
  private getLinearSearchResponse(): AIResponse { return this.getGenericHelpfulResponse("linear search"); }
  private getLinkedListResponse(): AIResponse { return this.getGenericHelpfulResponse("linked list"); }
  private getStackResponse(): AIResponse { return this.getGenericHelpfulResponse("stack"); }
  private getQueueResponse(): AIResponse { return this.getGenericHelpfulResponse("queue"); }
  private getBinaryTreeResponse(): AIResponse { return this.getGenericHelpfulResponse("binary tree"); }
  private getGraphResponse(): AIResponse { return this.getGenericHelpfulResponse("graph"); }
  private getDynamicProgrammingResponse(): AIResponse { return this.getGenericHelpfulResponse("dynamic programming"); }
  private getTwoPointerResponse(): AIResponse { return this.getGenericHelpfulResponse("two pointer"); }
  private getSlidingWindowResponse(): AIResponse { return this.getGenericHelpfulResponse("sliding window"); }
  private getDFSResponse(): AIResponse { return this.getGenericHelpfulResponse("dfs"); }
  private getBFSResponse(): AIResponse { return this.getGenericHelpfulResponse("bfs"); }
  private getComplexityAnalysisResponse(): AIResponse { return this.getGenericHelpfulResponse("complexity analysis"); }

  // Set API key dynamically
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  }

  // Check if AI service is available (always true now)
  isAIServiceAvailable(): boolean {
    return true;
  }

  // Clear API key
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('openai_api_key');
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      console.log('Testing API connection...');
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      });
      
      console.log('Test response status:', response.status);
      const result = response.ok;
      console.log('API connection test result:', result);
      return result;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
