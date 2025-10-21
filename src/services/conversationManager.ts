// Conversation Context Manager
export interface ConversationMessage {
  id: string;
  from: "user" | "assistant";
  text: string;
  timestamp: Date;
  metadata?: {
    code?: string;
    complexity?: {
      time: string;
      space: string;
    };
    examples?: string[];
    relatedTopics?: string[];
  };
}

export interface ConversationState {
  messages: ConversationMessage[];
  currentTopic?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  sessionId: string;
}

class ConversationManager {
  private conversations: Map<string, ConversationState> = new Map();
  private currentSessionId: string;

  constructor() {
    this.currentSessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    const initialState: ConversationState = {
      messages: [
        {
          id: 'welcome',
          from: 'assistant',
          text: "Hi! I'm your DSA assistant. I can help you understand algorithms, data structures, complexity analysis, and provide code examples. What would you like to learn about?",
          timestamp: new Date(),
          metadata: {
            relatedTopics: ['Sorting Algorithms', 'Searching Algorithms', 'Data Structures', 'Complexity Analysis']
          }
        }
      ],
      currentTopic: undefined,
      userLevel: 'beginner',
      sessionId: this.currentSessionId
    };

    this.conversations.set(this.currentSessionId, initialState);
  }

  // Add a new message to the conversation
  addMessage(message: Omit<ConversationMessage, 'id' | 'timestamp'>): ConversationMessage {
    const newMessage: ConversationMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    const conversation = this.conversations.get(this.currentSessionId);
    if (conversation) {
      conversation.messages.push(newMessage);
      
      // Update current topic based on message content
      this.updateCurrentTopic(newMessage.text);
      
      // Update user level based on conversation complexity
      this.updateUserLevel();
    }

    return newMessage;
  }

  // Get current conversation state
  getCurrentConversation(): ConversationState | undefined {
    return this.conversations.get(this.currentSessionId);
  }

  // Get conversation context for AI
  getConversationContext(): {
    previousMessages: string[];
    currentTopic?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  } {
    const conversation = this.conversations.get(this.currentSessionId);
    if (!conversation) {
      return { previousMessages: [] };
    }

    return {
      previousMessages: conversation.messages
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.from}: ${msg.text}`),
      currentTopic: conversation.currentTopic,
      userLevel: conversation.userLevel
    };
  }

  // Update current topic based on message analysis
  private updateCurrentTopic(messageText: string): void {
    const conversation = this.conversations.get(this.currentSessionId);
    if (!conversation) return;

    const text = messageText.toLowerCase();
    
    // Topic detection keywords
    const topicKeywords = {
      'sorting': ['sort', 'bubble', 'quick', 'merge', 'heap', 'selection', 'insertion'],
      'searching': ['search', 'binary', 'linear', 'find', 'lookup'],
      'data structures': ['linked list', 'stack', 'queue', 'tree', 'graph', 'hash'],
      'complexity': ['big o', 'complexity', 'time complexity', 'space complexity', 'o(n)', 'o(log n)'],
      'two pointer': ['two pointer', 'two pointers', 'left right', 'start end'],
      'dynamic programming': ['dp', 'dynamic programming', 'memoization', 'tabulation'],
      'graphs': ['graph', 'dfs', 'bfs', 'dijkstra', 'shortest path'],
      'trees': ['tree', 'binary tree', 'bst', 'traversal', 'inorder', 'preorder', 'postorder']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        conversation.currentTopic = topic;
        break;
      }
    }
  }

  // Update user level based on conversation complexity
  private updateUserLevel(): void {
    const conversation = this.conversations.get(this.currentSessionId);
    if (!conversation) return;

    const recentMessages = conversation.messages.slice(-5);
    const complexityIndicators = {
      beginner: ['what is', 'explain', 'how does', 'simple', 'basic', 'beginner'],
      intermediate: ['optimize', 'improve', 'better', 'efficient', 'complexity'],
      advanced: ['implement', 'design', 'architecture', 'scalable', 'distributed', 'concurrent']
    };

    let levelScore = 0;
    for (const message of recentMessages) {
      const text = message.text.toLowerCase();
      
      for (const [level, indicators] of Object.entries(complexityIndicators)) {
        if (indicators.some(indicator => text.includes(indicator))) {
          levelScore += level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;
        }
      }
    }

    // Determine user level based on score
    if (levelScore >= 8) {
      conversation.userLevel = 'advanced';
    } else if (levelScore >= 4) {
      conversation.userLevel = 'intermediate';
    } else {
      conversation.userLevel = 'beginner';
    }
  }

  // Clear current conversation
  clearConversation(): void {
    this.currentSessionId = this.generateSessionId();
    this.initializeSession();
  }

  // Get conversation history for a specific session
  getConversationHistory(sessionId: string): ConversationState | undefined {
    return this.conversations.get(sessionId);
  }

  // Export conversation for saving
  exportConversation(): string {
    const conversation = this.conversations.get(this.currentSessionId);
    return JSON.stringify(conversation, null, 2);
  }

  // Import conversation from saved data
  importConversation(data: string): boolean {
    try {
      const conversation: ConversationState = JSON.parse(data);
      this.conversations.set(conversation.sessionId, conversation);
      this.currentSessionId = conversation.sessionId;
      return true;
    } catch (error) {
      console.error('Failed to import conversation:', error);
      return false;
    }
  }

  // Get suggested topics based on current conversation
  getSuggestedTopics(): string[] {
    const conversation = this.conversations.get(this.currentSessionId);
    if (!conversation) return [];

    const baseTopics = [
      'Sorting Algorithms', 'Searching Algorithms', 'Data Structures',
      'Complexity Analysis', 'Two Pointer Technique', 'Dynamic Programming'
    ];

    // Add topic-specific suggestions based on current topic
    if (conversation.currentTopic === 'sorting') {
      return ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'];
    } else if (conversation.currentTopic === 'searching') {
      return ['Binary Search', 'Linear Search', 'Ternary Search', 'Jump Search'];
    } else if (conversation.currentTopic === 'data structures') {
      return ['Linked List', 'Stack', 'Queue', 'Binary Tree', 'Hash Table'];
    }

    return baseTopics;
  }
}

export const conversationManager = new ConversationManager();
