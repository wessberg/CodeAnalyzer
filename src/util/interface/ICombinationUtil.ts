export interface ICombinationUtil {
	allCombinations (elements: number[]): number[][];
	getPossibleCombinationsOfMultiDimensionalArray<T> (arr: T[][]): T[][];
}