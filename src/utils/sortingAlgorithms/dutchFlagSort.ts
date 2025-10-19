import { SortingAlgorithms } from "../../enums/SortingAlgorithms"
import { SortingAlgorithm } from "../../types/algorithms"
import { SortStep } from "../../types/steps"

export class DutchFlagSort implements SortingAlgorithm {
  name = "Dutch Flag Sort"
  description = "A variation of QuickSort that efficiently handles duplicates by partitioning the array into three parts: elements less than, equal to, and greater than the pivot."
  timeComplexity = "O(n)"
  spaceComplexity = "O(1)"
  bestCase = "O(n)"
  worstCase = "O(n)"
  algorithm = SortingAlgorithms.DutchFlagSort

  code = `function dutchFlagSort(arr) {
  let low = 0;
  let mid = 0;
  let high = arr.length - 1;
  
  // We choose arr[high] as the pivot
  const pivot = arr[high];
  
  while (mid <= high) {
    if (arr[mid] < pivot) {
      // Element is less than pivot
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++;
      mid++;
    } 
    else if (arr[mid] > pivot) {
      // Element is greater than pivot
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;
    } 
    else {
      // Element is equal to pivot
      mid++;
    }
  }
  
  return arr;
}`

  generateSteps(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]

    steps.push({
      array: [...arr],
      description: `Initial array: [${arr.join(", ")}]`,
      code: `// Initial array\nlet arr = [${arr.join(", ")}];`,
    })

    this.dutchFlagSortHelper(arr, steps)

    steps.push({
      array: [...arr],
      description: `Dutch Flag sort complete! Final array: [${arr.join(", ")}]`,
      code: `// Dutch Flag sort completed\n// Final array: [${arr.join(", ")}]`,
      sorted: Array.from({ length: arr.length }, (_, i) => i),
    })

    return steps
  }

  private dutchFlagSortHelper(arr: number[], steps: SortStep[]): void {
    if (arr.length <= 1) {
      return
    }

    // Choose the last element as pivot for consistency with quick sort example
    const pivot = arr[arr.length - 1]
    let low = 0
    let mid = 0
    let high = arr.length - 1

    steps.push({
      array: [...arr],
      description: `Choosing pivot: ${pivot} (last element)`,
      code: `let pivot = arr[${high}]; // ${pivot}\nlet low = 0;\nlet mid = 0;\nlet high = ${high};`,
      pivot: high,
    })

    while (mid <= high) {
      steps.push({
        array: [...arr],
        description: `Current state: low=${low}, mid=${mid}, high=${high}. Comparing arr[${mid}]=${arr[mid]} with pivot ${pivot}`,
        code: `while (mid <= high) {\n  // Current: low=${low}, mid=${mid}, high=${high}\n  // Comparing arr[${mid}]=${arr[mid]} with pivot=${pivot}\n}`,
        comparing: [mid, arr.length - 1],
        // Custom property to highlight the three sections
        dutchFlags: {
          lowSection: Array.from({ length: low }, (_, i) => i),
          midSection: Array.from({ length: mid - low }, (_, i) => i + low),
          highSection: Array.from({ length: arr.length - high - 1 }, (_, i) => i + high + 1)
        }
      })

      if (arr[mid] < pivot) {
        steps.push({
          array: [...arr],
          description: `${arr[mid]} < ${pivot}, so swap arr[${low}]=${arr[low]} and arr[${mid}]=${arr[mid]} and increment low and mid`,
          code: `if (arr[${mid}] < pivot) {\n  // ${arr[mid]} < ${pivot} is true\n  [arr[${low}], arr[${mid}]] = [arr[${mid}], arr[${low}]];\n  low++; // low becomes ${low + 1}\n  mid++; // mid becomes ${mid + 1}\n}`,
          swapping: [low, mid]
        })

        ;[arr[low], arr[mid]] = [arr[mid], arr[low]]
        low++
        mid++
      } 
      else if (arr[mid] > pivot) {
        steps.push({
          array: [...arr],
          description: `${arr[mid]} > ${pivot}, so swap arr[${mid}]=${arr[mid]} and arr[${high}]=${arr[high]} and decrement high`,
          code: `else if (arr[${mid}] > pivot) {\n  // ${arr[mid]} > ${pivot} is true\n  [arr[${mid}], arr[${high}]] = [arr[${high}], arr[${mid}]];\n  high--; // high becomes ${high - 1}\n}`,
          swapping: [mid, high]
        })

        ;[arr[mid], arr[high]] = [arr[high], arr[mid]]
        high--
      } 
      else {
        steps.push({
          array: [...arr],
          description: `${arr[mid]} = ${pivot}, no swap needed. Just increment mid`,
          code: `else {\n  // ${arr[mid]} = ${pivot}\n  mid++; // mid becomes ${mid + 1}\n}`,
        })

        mid++
      }
    }

    steps.push({
      array: [...arr],
      description: `Dutch Flag partition complete! Array is now partitioned into three sections: < ${pivot}, = ${pivot}, > ${pivot}`,
      code: `// Dutch Flag partitioning complete\n// arr: [${arr.join(", ")}]\n// Elements before index ${low} are less than ${pivot}\n// Elements from index ${low} to ${high} are equal to ${pivot}\n// Elements after index ${high} are greater than ${pivot}`,
      dutchFlags: {
        lowSection: Array.from({ length: low }, (_, i) => i),
        midSection: Array.from({ length: high - low + 1 }, (_, i) => i + low),
        highSection: Array.from({ length: arr.length - high - 1 }, (_, i) => i + high + 1)
      }
    })
  }
}