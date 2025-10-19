import React, { useState, useEffect, useRef } from "react"
import { Brain, Send, Loader2, Clock, Zap, RotateCcw, Copy, Check } from "lucide-react"
import { aiService, AIResponse } from "../services/aiService"
import { conversationManager, ConversationMessage } from "../services/conversationManager"

export default function AIAssistantPage(): JSX.Element {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize conversation
  useEffect(() => {
    const conversation = conversationManager.getCurrentConversation()
    if (conversation) {
      setMessages(conversation.messages)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    // Add user message
    const userMessage = conversationManager.addMessage({
      from: "user",
      text: trimmed
    })
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get conversation context
      const context = conversationManager.getConversationContext()
      
      // Get AI response
      const aiResponse: AIResponse = await aiService.getResponse(trimmed, context)
      
      // Add assistant message
      const assistantMessage = conversationManager.addMessage({
        from: "assistant",
        text: aiResponse.text,
        metadata: {
          code: aiResponse.code,
          complexity: aiResponse.complexity,
          examples: aiResponse.examples,
          relatedTopics: aiResponse.relatedTopics
        }
      })
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage = conversationManager.addMessage({
        from: "assistant",
        text: "I'm sorry, I encountered an error. Please try again or check your internet connection."
      })
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickAsk = (text: string) => {
    setInput(text)
    setTimeout(() => sendMessage(), 100)
  }

  const clearConversation = () => {
    conversationManager.clearConversation()
    const conversation = conversationManager.getCurrentConversation()
    if (conversation) {
      setMessages(conversation.messages)
    }
  }


  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">DSA AI Assistant</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🤖 Powered by OpenAI GPT-4 - Ask me anything about DSA!
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearConversation}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Clear conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Ask me anything about DSA! Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => quickAsk("Explain Dijkstra's shortest path algorithm")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Dijkstra's Algorithm
          </button>
          <button onClick={() => quickAsk("How do I implement a trie data structure?")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Trie Implementation
          </button>
          <button onClick={() => quickAsk("What's the difference between BFS and DFS?")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            BFS vs DFS
          </button>
          <button onClick={() => quickAsk("Explain dynamic programming with examples")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Dynamic Programming
          </button>
          <button onClick={() => quickAsk("How to solve the knapsack problem?")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Knapsack Problem
          </button>
          <button onClick={() => quickAsk("Explain time complexity analysis")} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Complexity Analysis
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border flex flex-col" style={{ minHeight: 500 }}>
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={message.from === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block max-w-[85%] ${message.from === "user" ? "ml-auto" : ""}`}>
                <div className={`px-4 py-3 rounded-lg ${
                  message.from === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}>
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  
                  {/* Code Block */}
                  {message.metadata?.code && (
                    <div className="mt-3 bg-gray-900 dark:bg-gray-800 rounded-md p-3 text-green-400 text-sm font-mono overflow-x-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Code:</span>
                        <button
                          onClick={() => copyToClipboard(message.metadata!.code!, message.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedMessageId === message.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre>{message.metadata.code}</pre>
                    </div>
                  )}
                  
                  {/* Complexity Analysis */}
                  {message.metadata?.complexity && (
                    <div className="mt-3 flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 dark:text-orange-400">
                          Time: {message.metadata.complexity.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-600 dark:text-purple-400">
                          Space: {message.metadata.complexity.space}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Examples */}
                  {message.metadata?.examples && message.metadata.examples.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <ul className="text-sm space-y-1">
                        {message.metadata.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-500">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Related Topics */}
                  {message.metadata?.relatedTopics && message.metadata.relatedTopics.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Related Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.metadata.relatedTopics.map((topic, index) => (
                          <button
                            key={index}
                            onClick={() => quickAsk(`Tell me about ${topic}`)}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
            value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about algorithms, data structures, complexity analysis, or request code examples..."
              className="flex-1 border rounded-md px-3 py-2 resize-none dark:bg-gray-700 dark:border-gray-600"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}