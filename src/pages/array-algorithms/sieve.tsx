"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import { Button } from "../../components/ui/button";

interface NumberElement {
  value: number;
  isPrime: boolean;
  isCrossedOut: boolean;
  isCurrentPrime: boolean;
  isMultiple: boolean;
}

interface Step {
  grid: NumberElement[];
  description: string;
  code: string;
}

function SievePage() {
  const [nInput, setNInput] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [showFullCode, setShowFullCode] = useState<boolean>(false);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsVisualizing(false);
    setShowFullCode(false);
  };

  const generateSieveSteps = (n: number) => {
    const newSteps: Step[] = [];
    let isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    const createGridState = (currentPrime: number | null, multiplesOf: number | null) => {
        return Array.from({ length: n + 1 }, (_, i) => ({
            value: i,
            isPrime: isPrime[i],
            isCrossedOut: !isPrime[i],
            isCurrentPrime: i === currentPrime,
            isMultiple: multiplesOf !== null && i % multiplesOf === 0 && i > multiplesOf
        }));
    };

    newSteps.push({
        grid: createGridState(null, null),
        description: `Initialize a boolean array isPrime of size ${n + 1}, marking all as true. 0 and 1 are not prime.`,
        code: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False`
    });

    for (let p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            newSteps.push({
                grid: createGridState(p, null),
                description: `Found a prime number: ${p}. Now marking its multiples.`,
                code: `for p in range(2, int(n**0.5) + 1):
    if is_prime[p]:`
            });

            let tempGrid = createGridState(p, p);
            for (let i = p * p; i <= n; i += p) {
                if(isPrime[i]) {
                    isPrime[i] = false;
                    tempGrid[i].isCrossedOut = true;
                }
            }
            newSteps.push({
                grid: tempGrid,
                description: `Marked all multiples of ${p} as not prime.`,
                code: `        for i in range(p*p, n + 1, p):
            is_prime[i] = False`
            });
        }
    }

    const finalPrimes = isPrime.map((p, i) => p ? i : -1).filter(p => p !== -1);
    newSteps.push({
        grid: createGridState(null, null),
        description: `Sieve complete. The prime numbers are: ${finalPrimes.join(', ')}`,
        code: `primes = []
for p in range(2, n + 1):
    if is_prime[p]:
        primes.append(p)
return primes`
    });

    return newSteps;
  };

  const handleVisualize = () => {
    try {
      const n = Number.parseInt(nInput.trim());
      if (isNaN(n) || n <= 1 || n > 200) {
        throw new Error("Please enter a valid number between 2 and 200.");
      }

      resetVisualization();
      setIsVisualizing(true);
      const newSteps = generateSieveSteps(n);
      setSteps(newSteps);
      setIsVisualizing(false);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    }
  };

  const getFullCode = () => {
    return `def sieve_of_eratosthenes(n):
    """
    Finds all prime numbers up to n using the Sieve of Eratosthenes algorithm.
    """
    # Create a boolean array "is_prime[0..n]" and initialize
    # all entries it as true. A value in is_prime[i] will
    # finally be false if i is Not a prime, else true.
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    for p in range(2, int(n**0.5) + 1):
        # If is_prime[p] is not changed, then it is a prime
        if is_prime[p]:
            # Update all multiples of p
            for i in range(p * p, n + 1, p):
                is_prime[i] = False

    # Collect all prime numbers
    primes = []
    for p in range(2, n + 1):
        if is_prime[p]:
            primes.append(p)
            
    return primes`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/array-algorithms"
                className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </Link>
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Sieve of Eratosthenes
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Input
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="n-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Find primes up to n
              </label>
              <input
                id="n-input"
                type="number"
                value={nInput}
                onChange={(e) => setNInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., 30"
              />
            </div>
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVisualizing ? "Visualizing..." : "Visualize"}
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Visualization
              </h2>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 text-center">
                {steps[currentStep].grid.map((element) => (
                    (element.value > 0) &&
                  <div key={element.value} 
                    className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 relative
                    ${element.isCurrentPrime ? 'bg-yellow-500 text-white' : ''}
                    ${element.isMultiple ? 'bg-red-200 dark:bg-red-800' : ''}
                    ${element.isCrossedOut && !element.isMultiple && !element.isCurrentPrime ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 line-through' : ''}
                    ${!element.isCrossedOut && !element.isCurrentPrime ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : ''}
                    `}>
                    {element.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Step Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {steps[currentStep].description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <button
                      onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="p-2 hover:bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(0)} variant="secondary">
                  Reset
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Code
                </h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700"
                >
                  <Code className="w-5 h-5" />
                  <span>
                    {showFullCode ? "Show Current Step" : "Show Full Code"}
                  </span>
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  {showFullCode ? getFullCode() : steps[currentStep].code}
                </code>
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h4 className="text-xl font-bold text-black dark:text-gray-200 mb-3">
            Practice Questions
          </h4>
          <div className="space-y-2">
            <a
              href="https://leetcode.com/problems/count-primes/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • LeetCode: Count Primes
            </a>
            <a
              href="https://practice.geeksforgeeks.org/problems/sieve-of-eratosthenes/0"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              • GFG: Sieve of Eratosthenes
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SievePage;
