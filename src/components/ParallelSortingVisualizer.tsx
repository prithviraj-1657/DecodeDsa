"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"

import { Badge } from "../components/ui/badge"
import { Play, Pause, RotateCcw} from "lucide-react"
import { generateSteps } from "../utils/sortingAlgorithms"

import Algorithm from "../types/algorithms"
import { SortingAlgorithms } from "../enums/SortingAlgorithms"
import { SortStep } from "../types/steps"

interface ParallelSortingVisualizerProps {
    algorithm1: Algorithm<SortingAlgorithms>
    algorithm2: Algorithm<SortingAlgorithms>
    inputArray: string
}

interface SortResult {
    comparisons: number
    swaps: number
    steps: number
}

const ParallelSortingVisualizer: React.FC<ParallelSortingVisualizerProps> = ({
                                                                                 algorithm1,
                                                                                 algorithm2,
                                                                                 inputArray
                                                                             }) => {
    const [steps1, setSteps1] = useState<SortStep[]>([])
    const [steps2, setSteps2] = useState<SortStep[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playSpeed, setPlaySpeed] = useState(1000)
    const [, setSortResult1] = useState<SortResult | null>(null);
    const [, setSortResult2] = useState<SortResult | null>(null);
    const [isOperationRunning, setIsOperationRunning] = useState(false) // ✅ new

    useEffect(() => {
        const array = inputArray
            .split(/[\s,]+/)
            .filter(n => n)
            .map(Number)
            .filter((n) => !isNaN(n))

        const newSteps1 = generateSteps(algorithm1.algorithm, array)
        const newSteps2 = generateSteps(algorithm2.algorithm, array)

        setSteps1(newSteps1)
        setSteps2(newSteps2)
        setCurrentStep(0)

        // Calculate metrics
        const comparisons1 = newSteps1.filter((step) => step.comparing?.length).length
        const swaps1 = newSteps1.filter((step) => step.swapping?.length).length
        setSortResult1({ comparisons: comparisons1, swaps: swaps1, steps: newSteps1.length })

        const comparisons2 = newSteps2.filter((step) => step.comparing?.length).length
        const swaps2 = newSteps2.filter((step) => step.swapping?.length).length
        setSortResult2({ comparisons: comparisons2, swaps: swaps2, steps: newSteps2.length })
    }, [algorithm1, algorithm2, inputArray])

    // Auto-play functionality
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying && currentStep < Math.max(steps1.length, steps2.length) - 1) {
            setIsOperationRunning(true) // ✅ operation running
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1)
            }, playSpeed)
        } else if (currentStep >= Math.max(steps1.length, steps2.length) - 1) {
            setIsPlaying(false)
            setIsOperationRunning(false) // ✅ operation finished
        }
        return () => clearInterval(interval)
    }, [isPlaying, currentStep, steps1.length, steps2.length, playSpeed])

    const handleNext = () => {
        if (currentStep < Math.max(steps1.length, steps2.length) - 1) {
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

    // --- rest of your getElementColor / getElementColorHex / prepareCanvasElements functions ---
    // keep all as-is

    const maxSteps = Math.max(steps1.length, steps2.length)
    

    return (
        <div className="space-y-6">
            {/* Comparison Header, Visualizations, Legend all remain unchanged */}

            {/* Enhanced Controls */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between">
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
                        <Button onClick={handleNext} disabled={currentStep === maxSteps - 1 || isOperationRunning} size="sm">
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
                            Step {currentStep + 1} of {maxSteps}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Code Comparison */}
            {/* unchanged */}
        </div>
    )
}

export default ParallelSortingVisualizer
