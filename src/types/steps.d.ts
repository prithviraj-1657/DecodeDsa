export default interface Step {
  array: number[]
  description: string
  code: string
  comparing?: number[]
}

export interface SortStep extends Step {
  swapping?: number[]
  sorted?: number[]
  pivot?: number
  dutchFlags?: {
    lowSection: number[]
    midSection: number[]
    highSection: number[]
  }
}


export interface SearchStep extends Step {
  currentIndex?: number
  found?: boolean
  foundIndex?: number
  left?: number
  right?: number
  mid?: number
  searchComplete?: boolean
}
