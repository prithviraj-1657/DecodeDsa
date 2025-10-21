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

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({algorithm, inputArray}) => {
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
                                    <ArrowUpDown className="w-6 h-6 text-blue-600"/>
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

            {/* Rest of the array visualization, controls, code display, complete implementation cards */}
            {/* This part remains identical to your shared code above */}
        </div>
    )
}

export default SortingVisualizer
