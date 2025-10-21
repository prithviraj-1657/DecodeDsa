"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "../components/ui/badge"
import { CheckCircle, XCircle, Search, Target, Play, Pause, RotateCcw, Copy, Check } from "lucide-react"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"
import { generateSteps as generateSearchSteps } from "../utils/searchingAlgorithms"
import { SearchStep } from "../types/steps"
import { SearchingAlgorithm } from "../types/algorithms"
import { SearchingAlgorithms } from "../enums/SearchingAlgorithms"

interface SearchingVisualizerProps {
  algorithm: SearchingAlgorithm
  inputArray: string
  targetValue: number
}

const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ algorithm, inputArray, targetValue }) => {
  const [steps, setSteps] = useState<SearchStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // milliseconds
  const [searchResult, setSearchResult] = useState<{ found: boolean; index: number; comparisons: number } | null>(null)
  const [copiedStep, setCopiedStep] = useState(false)
  const [copiedFull, setCopiedFull] = useState(false)

  // ✅ new state to disable buttons while running
  const [isOperationRunning, setIsOperationRunning] = useState(false)

  const copyToClipboard = async (
      text: string,
      setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
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
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
    }
  }

  useEffect(() => {
    const array = inputArray
        .split(/[\s,]+/).filter(n => n)
        .map(Number)
        .filter((n) => !isNaN(n))

    const newSteps = generateSearchSteps(algorithm.algorithm, array, targetValue)
    setSteps(newSteps)
    setCurrentStep(0)

    // Calculate search result
    const lastStep = newSteps[newSteps.length - 1]
    if (lastStep) {
      const comparisons = newSteps.filter((step) => step.comparing).length
      setSearchResult({
        found: lastStep.found || false,
        index: lastStep.foundIndex || -1,
        comparisons,
      })
    }
  }, [algorithm, inputArray, targetValue])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      setIsOperationRunning(true) // ✅ mark running
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, playSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      setIsOperationRunning(false) // ✅ finished
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, playSpeed])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const getElementColor = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "bg-blue-500"

    if (step.foundIndex === index && step.found) return "bg-green-500"
    if (step.comparing?.includes(index)) return "bg-yellow-500"
    if (step.currentIndex === index) return "bg-orange-500"
    if (step.mid === index) return "bg-purple-500"
    if (algorithm.algorithm === SearchingAlgorithms.BinarySearch && step.left !== undefined && step.right !== undefined) {
      if (index < step.left || index > step.right) return "bg-gray-400"
    }

    return "bg-blue-500"
  }

  const getElementColorHex = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "#3b82f6" // blue-500

    if (step.foundIndex === index && step.found) return "#22c55e" // green-500
    if (step.comparing?.includes(index)) return "#eab308" // yellow-500
    if (step.currentIndex === index) return "#f97316" // orange-500
    if (step.mid === index) return "#a855f7" // purple-500
    if (algorithm.algorithm === SearchingAlgorithms.BinarySearch && step.left !== undefined && step.right !== undefined) {
      if (index < step.left || index > step.right) return "#9ca3af" // gray-400
    }

    return "#3b82f6" // blue-500
  }

  const prepareCanvasElements = () => {
    const step = steps[currentStep]
    if (!step) return []

    return step.array.map((value, index) => ({
      value,
      index,
      color: getElementColorHex(index),
    }))
  }

  if (steps.length === 0) {
    return (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading visualization...</div>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Search Result Summary */}
        {searchResult && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-6">
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-center space-x-3">
                    {searchResult.found ? (
                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                    ) : (
                        <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold truncate">{searchResult.found ? "Target Found!" : "Target Not Found"}</h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {searchResult.found
                            ? `Found at index ${searchResult.index}`
                            : "Target value does not exist in the array"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{searchResult.comparisons}</div>
                    <div className="text-sm text-gray-500">Comparisons</div>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Array Visualization */}
        <div className="w-full bg-white rounded-lg p-6 shadow-sm border">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="w-[60%] text-lg font-semibold flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-600" />
              <span className="truncate">Array Visualization</span>
            </h3>
            <div className="text-gray-600">
              Target: <span className="font-semibold text-green-600">{targetValue}</span>
            </div>
          </div>

          {steps[currentStep]?.array.length >= 100 ? (
              <div className="flex justify-center">
                <ZoomableArrayCanvas
                    elements={prepareCanvasElements()}
                    width={Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 100 : 1000)}
                    height={200}
                />
              </div>
          ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
                {steps[currentStep]?.array.map((value, index) => (
                    <div key={index} className="relative">
                      <div
                          className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(index)}`}
                      >
                        {value}
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">{index}</div>

                      {/* Binary Search Pointers */}
                      {algorithm.algorithm === SearchingAlgorithms.BinarySearch && steps[currentStep] && (
                          <>
                            {steps[currentStep].left === index && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600">
                                  L
                                </div>
                            )}
                            {steps[currentStep].right === index && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-600">
                                  R
                                </div>
                            )}
                            {steps[currentStep].mid === index && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600">
                                  M
                                </div>
                            )}
                          </>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Unvisited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Comparing</span>
          </div>
          {algorithm.algorithm === SearchingAlgorithms.LinearSearch && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Current</span>
              </div>
          )}
          {algorithm.algorithm === SearchingAlgorithms.BinarySearch && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Middle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Out of Range</span>
                </div>
              </>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Found</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Button onClick={handleReset} variant="secondary" size="sm" disabled={isOperationRunning}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button onClick={handlePrevious} disabled={currentStep === 0 || isOperationRunning} variant="secondary" size="sm">
                Previous
              </Button>
              <Button
                  onClick={togglePlay}
                  variant={isPlaying ? "secondary" : "primary"}
                  size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={handleNext} disabled={currentStep === steps.length - 1 || isOperationRunning} size="sm">
                Next
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <select
                    value={playSpeed}
                    onChange={(e) => setPlaySpeed(Number(e.target.value))}
                    className="text-sm border rounded px-2 py-1"
                >
                  <option value={2000}>0.5x</option>
                  <option value={1000}>1x</option>
                  <option value={500}>2x</option>
                  <option value={250}>4x</option>
                </select>
              </div>
              <Badge variant="default" className="text-sm">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Step Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Step Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{steps[currentStep]?.description}</p>
          </CardContent>
        </Card>

        {/* Code Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Code Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                  className="absolute top-2 right-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white shadow"
                  onClick={() => copyToClipboard(steps[currentStep]?.code ?? '', setCopiedStep)}
                  aria-label="Copy step code"
              >
                {copiedStep ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedStep ? 'Copied' : 'Copy'}
              </button>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono">
              <code>{steps[currentStep]?.code}</code>
            </pre>
            </div>
          </CardContent>
        </Card>

        {/* Complete Algorithm Code - Show only when search is complete */}
        {steps[currentStep]?.searchComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete {algorithm.name} Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <button
                      className="absolute top-2 right-6 inline-flex items-center gap-1 rounded px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white shadow"
                      onClick={() => copyToClipboard(algorithm.code ?? '', setCopiedFull)}
                      aria-label="Copy full implementation"
                  >
                    {copiedFull ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedFull ? 'Copied' : 'Copy'}
                  </button>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
                <code>{algorithm.code}</code>
              </pre>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>💡 Complete Implementation:</strong> This is the full {algorithm.name} algorithm that you just
                    visualized step by step. You can copy this code and use it in your own projects!
                  </p>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  )
}

export default SearchingVisualizer
