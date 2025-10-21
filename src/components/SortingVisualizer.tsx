import type React from "react"
import {useEffect, useState} from "react"
import {Button} from "../components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card"
import {Badge} from "../components/ui/badge"
import {ArrowUpDown, Code, Play, Pause, RotateCcw, Copy, Check} from "lucide-react"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"
import {generateSteps} from "../utils/sortingAlgorithms"
import {SortStep} from "../types/steps"
import {SortingAlgorithm} from "../types/algorithms"

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
  const [showCompleteCode, setShowCompleteCode] = useState(false) // New state for showing complete code

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
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1)
        }
      } else if (event.key === "ArrowRight") {
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

    if (step.dutchFlags?.lowSection.includes(index)) return "#ec4899"
    if (step.dutchFlags?.midSection.includes(index)) return "#ffffff"
    if (step.dutchFlags?.highSection.includes(index)) return "#3b82f6"

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
                  <h3 className="text-lg font-semibold dark:text-black">
                    {algorithm.name} Statistics
                  </h3>
                  <p className="text-gray-600">
                    Step-by-step visualization of the sorting process
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mt-3">
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-blue-600">
                    {sortResult.comparisons}
                  </div>
                  <div className="text-sm text-gray-500">Comparisons</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-red-600">
                    {sortResult.swaps}
                  </div>
                  <div className="text-sm text-gray-500">Swaps</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-purple-600">
                    {sortResult.steps}
                  </div>
                  <div className="text-sm text-gray-500">Total Steps</div>
                </div>
              </div>
            </div>
            {sortResult.isDutchFlag && (
              <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-sm mb-2">Dutch Flag Legend:</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Less than pivot
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Equal to pivot
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Greater than pivot
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Pivot
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="w-full bg-white rounded-lg p-4 md:p-6 shadow-sm border">
        <div className="w-full flex items-center justify-between mb-4">
          <h3
            className="w-[60%] text-base md:text-lg font-semibold flex items-center"
            title="Array Visualization"
          >
            <ArrowUpDown className="w-6 h-6 mr-2 text-blue-600" />
            <span className="truncate dark:text-black">
              Array Visualization
            </span>
          </h3>
          <div className="text-sm md:text-base text-gray-600 text-right flex flex-col md:flex-row md:gap-1">
            <span>Algorithm:</span>
            <span className="font-semibold text-blue-600">
              {algorithm.name}
            </span>
          </div>
        </div>

        {steps[currentStep]?.array.length >= 15 ? (
          <div className="flex justify-center">
            <ZoomableArrayCanvas
              elements={prepareCanvasElements()}
              width={Math.min(
                1000,
                typeof window !== "undefined" ? window.innerWidth - 100 : 1000
              )}
              height={200}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
            {steps[currentStep]?.array.map((value, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(
                    index
                  )}`}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {index}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
              </div>
              Step Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] text-gray-700">
              {steps[currentStep]?.description || "No description available."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-full">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              Code Execution
              <Button
                  variant="secondary"
                  size="sm"
                  className="ml-auto"
                  onClick={() =>
                    copyToClipboard(
                      steps[currentStep]?.code || "",
                      setCopiedStep
                    )
                  }
                >
                  {copiedStep ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copiedStep ? "Copied" : "Copy"}
                </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {steps[currentStep]?.code || "No code available."}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Code Section */}
      {showCompleteCode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-full">
                <Code className="w-5 h-5 text-green-600" />
              </div>
              Complete Algorithm Implementation
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto"
                onClick={() =>
                  copyToClipboard(algorithm.code, setCopiedFull)
                }
              >
                {copiedFull ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copiedFull ? "Copied" : "Copy"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {algorithm.code}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowUpDown className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className={isPlaying ? "bg-red-50" : ""}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            <ArrowUpDown className="h-4 w-4 -rotate-90" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={showCompleteCode ? "secondary" : "primary"}
            size="sm"
            onClick={() => setShowCompleteCode(!showCompleteCode)}
            className={showCompleteCode ? "bg-blue-600" : ""}
          >
           <Code className="h-4 w-4 mr-2" />
            {showCompleteCode ? "Hide Complete Code" : "Show Complete Code"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Speed:</span>
            <select
              className="border rounded p-1 text-sm"
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
            >
              <option value="2000">Slow</option>
              <option value="1000">Normal</option>
              <option value="500">Fast</option>
              <option value="200">Very Fast</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Step:</span>
          <Badge variant="default" className="text-blue-600">
            {currentStep + 1} / {steps.length}
          </Badge>
        </div>
      </div>

      {/* Original implementation section - shown at the end of visualization */}
      {currentStep === steps.length - 1 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Original Implementation
          </h3>
          <div className="bg-white p-4 rounded-md shadow-sm overflow-x-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {algorithm.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default SortingVisualizer
