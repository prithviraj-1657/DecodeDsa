import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import {
  Brain,
  Send,
  Loader2,
  Clock,
  Zap,
  RotateCcw,
  Copy,
  Check,
  User,
  Bot
} from "lucide-react"
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">DSA AI Assistant</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">🤖 Powered by OpenAI GPT-4 — Ask anything about algorithms & data structures</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">Press <kbd className="px-2 py-0.5 bg-gray-100 rounded border">Enter</kbd> to send — <kbd className="px-2 py-0.5 bg-gray-100 rounded border">Shift+Enter</kbd> for newline</span>
          <button
            onClick={clearConversation}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center gap-2"
            aria-label="Clear conversation"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Back to home"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: quick actions */}
        <aside className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Prompts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try these to get started or refine your question.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => quickAsk("Explain Dijkstra's shortest path algorithm")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Dijkstra's Algorithm
            </button>
            <button onClick={() => quickAsk("How do I implement a trie data structure?")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Trie Implementation
            </button>
            <button onClick={() => quickAsk("What's the difference between BFS and DFS?")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              BFS vs DFS
            </button>
            <button onClick={() => quickAsk("Explain dynamic programming with examples")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Dynamic Programming
            </button>
            <button onClick={() => quickAsk("How to solve the knapsack problem?")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Knapsack Problem
            </button>
            <button onClick={() => quickAsk("Explain time complexity analysis")} className="text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              Complexity Analysis
            </button>
          </div>
        </aside>

        {/* Main chat area */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border flex flex-col" style={{ minHeight: 520 }}>
          <div className="flex-1 overflow-auto p-6 space-y-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                {/* Avatar */}
                {message.from !== "user" ? (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className={`max-w-[85%] ${message.from === "user" ? "ml-auto text-right" : ""}`}>
                  <div className={`px-4 py-3 rounded-lg shadow-sm transform transition duration-150 ease-in-out ${
                    message.from === "user" ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" : "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:bg-gray-900 prose-pre:text-green-400">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>

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
                      <div className="mt-3 flex gap-4 text-sm justify-center sm:justify-start">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600 dark:text-orange-400">Time: {message.metadata.complexity.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-purple-500" />
                          <span className="text-purple-600 dark:text-purple-400">Space: {message.metadata.complexity.space}</span>
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

                  <div className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
                <div className="inline-block bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about algorithms, data structures, or complexity..."
                  className="w-full border-0 rounded-2xl px-4 py-3 pr-12 resize-none bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}