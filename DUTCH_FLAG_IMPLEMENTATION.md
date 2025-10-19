# Dutch Flag Algorithm Implementation

## Overview

The Dutch Flag algorithm (also known as Dutch National Flag algorithm) is an efficient sorting algorithm designed for the specific case where the array has 3 distinct values. It's named after the Dutch national flag, which has three colors: red, white, and blue.

In our implementation, it's used as a three-way partitioning scheme that can:

1. Partition an array around a pivot value into three parts:
   - Elements less than the pivot
   - Elements equal to the pivot
   - Elements greater than the pivot

## Technical Implementation

### Algorithm

The Dutch Flag algorithm works as follows:

1. Choose a pivot value (in our implementation, we use the last element)
2. Use three pointers:
   - `low`: pointing to the boundary of elements less than the pivot
   - `mid`: current element being examined
   - `high`: pointing to the boundary of elements greater than the pivot
3. Process the array by comparing each element with the pivot:
   - If the element is less than the pivot, swap it with the element at the `low` pointer and increment both `low` and `mid`
   - If the element is equal to the pivot, just increment `mid`
   - If the element is greater than the pivot, swap it with the element at the `high` pointer and decrement `high`
4. Continue until `mid` is greater than `high`

### Integration into the Codebase

1. Added `DutchFlagSort` to the `SortingAlgorithms` enum
2. Created a new class `DutchFlagSort` implementing the `SortingAlgorithm` interface
3. Enhanced the `SortStep` interface to include `dutchFlags` property for visualization
4. Updated the visualization component to handle Dutch Flag's three-way partitioning
5. Added special coloring in the UI to represent the three partitions

### Visual Representation

The Dutch Flag sort is visually represented using the colors of the Dutch flag:
- Pink (representing red): Elements less than the pivot
- White: Elements equal to the pivot
- Blue: Elements greater than the pivot

## Time and Space Complexity

- Time Complexity: O(n) where n is the number of elements in the array
- Space Complexity: O(1) as it sorts in-place

## Applications

The Dutch Flag algorithm is particularly useful for:
1. Efficiently sorting arrays with many duplicates
2. As a subroutine in Quicksort to handle duplicates more efficiently
3. Solving the "Sort an array of 0s, 1s, and 2s" problem (also known as the Dutch National Flag problem)

## Future Enhancements

- Option to choose different pivot selection strategies
- Integration with QuickSort to create a more efficient hybrid algorithm
- Extension to handle more than three distinct values efficiently