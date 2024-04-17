export function duplicateArray<T>(array: T[], N: number): T[] {
  // Create an array of length N filled with the original array
  return Array(N).fill(array).flat();
}
