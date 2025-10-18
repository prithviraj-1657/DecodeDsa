import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowUpDown, Code, Play, Pause, RotateCcw, Copy, Check } from "lucide-react"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"
import { generateSteps } from "../utils/sortingAlgorithms"
import { SortStep } from "../types/steps"
import { SortingAlgorithm } from "../types/algorithms"

interface SortingVisualizerProps {
  algorithm: SortingAlgorithm
  inputArray: string
}

interface SortResult {
  comparisons: number
  swaps: number
  steps: number
  isDutchFlag?: boolean
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm, inputArray }) => {
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // milliseconds
  const [sortResult, setSortResult] = useState<SortResult | null>(null)
  const [copiedStep, setCopiedStep] = useState(false)
  const [copiedFull, setCopiedFull] = useState(false)

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
      .split(/[\s,]+/)
      .filter(n => n)
      .map(Number)
      .filter((n) => !isNaN(n))
    const newSteps = generateSteps(algorithm.algorithm, array)
    setSteps(newSteps)
    setCurrentStep(0)

    const comparisons = newSteps.filter((step) => step.comparing?.length).length
    const swaps = newSteps.filter((step) => step.swapping?.length).length
    const isDutchFlag = algorithm.name === "Dutch Flag Sort"
    
    setSortResult({
      comparisons,
      swaps,
      steps: newSteps.length,
      isDutchFlag
    })
  }, [algorithm, inputArray])

  // Keyboard navigation accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        // Handle previous
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1)
        }
      } else if (event.key === "ArrowRight") {
        // Handle next
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, steps.length])


  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, playSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
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

    if (step.sorted?.includes(index)) return "bg-green-500"
    if (step.swapping?.includes(index)) return "bg-red-500"
    if (step.comparing?.includes(index)) return "bg-yellow-500"
    if (step.pivot === index) return "bg-purple-500"
    
    // Dutch Flag algorithm specific colors
    if (step.dutchFlags?.lowSection.includes(index)) return "bg-pink-500"
    if (step.dutchFlags?.midSection.includes(index)) return "bg-white"
    if (step.dutchFlags?.highSection.includes(index)) return "bg-blue-500"

    return "bg-blue-500"
  }

  const getElementColorHex = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "#3b82f6"

    if (step.sorted?.includes(index)) return "#22c55e"
    if (step.swapping?.includes(index)) return "#ef4444"
    if (step.comparing?.includes(index)) return "#eab308"
    if (step.pivot === index) return "#a855f7"
    
    // Dutch Flag algorithm specific colors
    if (step.dutchFlags?.lowSection.includes(index)) return "#ec4899" // Pink (Dutch Flag red)
    if (step.dutchFlags?.midSection.includes(index)) return "#ffffff" // White (Dutch Flag white)
    if (step.dutchFlags?.highSection.includes(index)) return "#3b82f6" // Blue (Dutch Flag blue)

    return "#3b82f6"
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
      {sortResult && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center justify-between space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{algorithm.name} Statistics</h3>
                  <p className="text-gray-600">Step-by-step visualization of the sorting process</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mt-3">
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-blue-600">{sortResult.comparisons}</div>
                  <div className="text-sm text-gray-500">Comparisons</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-red-600">{sortResult.swaps}</div>
                  <div className="text-sm text-gray-500">Swaps</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-purple-600">{sortResult.steps}</div>
                  <div className="text-sm text-gray-500">Total Steps</div>
                </div>
              </div>
              
              {sortResult.isDutchFlag && (
                <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-sm mb-2">Dutch Flag Legend:</h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">Less than pivot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">Equal to pivot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">Greater than pivot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">Pivot</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      )}

      <div className="w-full bg-white rounded-lg p-4 md:p-6 shadow-sm border">
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="w-[60%] text-base md:text-lg font-semibold flex items-center" title="Array Visualization">
            <ArrowUpDown className="w-6 h-6 mr-2 text-blue-600" />
            <span className="truncate">Array Visualization</span>
          </h3>
          <div className="text-sm md:text-base text-gray-600 text-right flex flex-col md:flex-row md:gap-1">
            <span>Algorithm:</span>
            <span className="font-semibold text-blue-600">{algorithm.name}</span>
          </div>
        </div>

        {steps[currentStep]?.array.length >= 15 ? (
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
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
        
        {sortResult?.isDutchFlag && (
          <>
            <div className="w-full border-t my-2 border-gray-200"></div>
            <div className="text-xs text-gray-500 w-full text-center mb-2">Dutch Flag Partitioning</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span>Less than pivot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white rounded border border-gray-300"></div>
              <span>Equal to pivot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Greater than pivot</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-center md:justify-between flex-wrap gap-4 md:gap-2 bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="secondary">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button onClick={handlePrevious} disabled={currentStep === 0} variant="secondary"  aria-label="Go to previous step">
            Previous
          </Button>
          <Button onClick={togglePlay} variant={isPlaying ? "secondary" : "primary"} size="sm">
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1} aria-label="Go to next step">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Step Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{steps[currentStep]?.description}</p>
        </CardContent>
      </Card>

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

      {currentStep === steps.length - 1 && (
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
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Complete Implementation:</strong> This is the full {algorithm.name} algorithm that you just
                visualized step by step. You can copy this code and use it in your own projects!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SortingVisualizer
