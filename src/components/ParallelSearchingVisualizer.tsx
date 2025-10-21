import React, { useState } from 'react';
import SearchingVisualizer from './SearchingVisualizer';
import { Info } from 'lucide-react';
import { SearchingAlgorithms } from '../enums/SearchingAlgorithms';
import { getAvailableAlgorithms } from '../utils/searchingAlgorithms';
import { Button } from '../components/ui/button'; // ✅ import Button

interface ParallelSearchingVisualizerProps {
    inputArray: string;
    targetValue: number;
}

const ParallelSearchingVisualizer: React.FC<ParallelSearchingVisualizerProps> = ({ inputArray, targetValue }) => {
    const [isRunning, setIsRunning] = useState(false); // ✅ loading state for button

    const arrayLength = inputArray.split(/[\s,]+/).filter(n => n).length;
    const isLargeArray = arrayLength >= 100;
    const availableAlgorithms = getAvailableAlgorithms();

    const linearSearchAlgorithm = availableAlgorithms.find(alg => alg.algorithm === SearchingAlgorithms.LinearSearch);
    const binarySearchAlgorithm = availableAlgorithms.find(alg => alg.algorithm === SearchingAlgorithms.BinarySearch);

    // ✅ our new button handler (simulated delay)
    const handleRunParallelSearch = async () => {
        setIsRunning(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2500)); // simulate operation
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-6">
            {isLargeArray && (
                <div className="flex items-start p-4 space-x-3 border border-blue-200 rounded-lg bg-blue-50">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <strong>Large Array Detected ({arrayLength} elements)</strong>
                        <p className="mt-1">
                            Canvas-based visualization with zoom and pan controls is enabled. Use scroll to zoom, drag to pan, or use the control buttons.
                        </p>
                    </div>
                </div>
            )}

            {/* ✅ New Run Parallel Search Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleRunParallelSearch}
                    isLoading={isRunning}
                    variant="primary"
                    size="md"
                    className="w-48"
                >
                    Run Parallel Search
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Panel: Linear Search */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="mb-4 text-lg font-bold text-center text-gray-800">Linear Search</h3>
                    <SearchingVisualizer
                        algorithm={linearSearchAlgorithm!}
                        inputArray={inputArray}
                        targetValue={targetValue}
                    />
                </div>

                {/* Right Panel: Binary Search */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="mb-4 text-lg font-bold text-center text-gray-800">Binary Search</h3>
                    <SearchingVisualizer
                        algorithm={binarySearchAlgorithm!}
                        inputArray={inputArray}
                        targetValue={targetValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default ParallelSearchingVisualizer;
