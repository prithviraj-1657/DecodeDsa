import { SortingAlgorithms } from "../../enums/SortingAlgorithms"
import { BubbleSort } from "./bubbleSort"
import { SelectionSort } from "./selectionSort"
import { InsertionSort } from "./insertionSort"
import { QuickSort } from "./quickSort"
import { MergeSort } from "./mergeSort"
import { HeapSort } from "./heapSort"
import { RadixSort } from "./radixSort"
import { ShellSort } from "./shellSort"
import { DutchFlagSort } from "./dutchFlagSort"
import { SortingAlgorithm } from "../../types/algorithms"

/**
 * Factory class for creating sorting algorithm instances
 * Implements the Factory Pattern for better extensibility
 */
export class SortingAlgorithmFactory {
  private static algorithms: Map<SortingAlgorithms, SortingAlgorithm> = new Map([
    [SortingAlgorithms.BubbleSort, new BubbleSort()],
    [SortingAlgorithms.SelectionSort, new SelectionSort()],
    [SortingAlgorithms.InsertionSort, new InsertionSort()],
    [SortingAlgorithms.MergeSort, new MergeSort()],
    [SortingAlgorithms.QuickSort, new QuickSort()],
    [SortingAlgorithms.HeapSort, new HeapSort()],
    [SortingAlgorithms.RadixSort, new RadixSort()],
    [SortingAlgorithms.ShellSort, new ShellSort()],
    [SortingAlgorithms.DutchFlagSort, new DutchFlagSort()]
  ])

  /**
   * Get a sorting algorithm instance by name
   * @param algorithmName - The name of the sorting algorithm
   * @returns The sorting algorithm instance
   * @throws Error if algorithm is not found
   */
  static getAlgorithm(algorithmName: SortingAlgorithms): SortingAlgorithm {
    const algorithm = this.algorithms.get(algorithmName)
    if (!algorithm) {
      throw new Error(`Sorting algorithm "${algorithmName}" not found`)
    }
    return algorithm
  }

  /**
   * Get all available sorting algorithm names
   * @returns Array of algorithm names
   */
  static getAvailableAlgorithms(): SortingAlgorithm[] {
    return Array.from(this.algorithms.values())
  }
}
