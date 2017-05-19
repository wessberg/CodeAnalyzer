import {ICombinationUtil} from "./interface/ICombinationUtil";

export class CombinationUtil implements ICombinationUtil {
	public allCombinations (elements: number[]): number[][] {
		return this.combine(elements);
	}

	private combine (elements: number[]): number[][] {
		const combs: number[][] = [];
		let k, i, k_combs;

		for (k = 1; k <= elements.length; k++) {
			k_combs = this.k_combinations(elements, k);
			for (i = 0; i < k_combs.length; i++) {
				combs.push(k_combs[i]);
			}
		}
		return combs;
	}

	private k_combinations (elements: number[], k: number): number[][] {
		let i, j, head, tailcombs;
		const combs: number[][] = [];

		if (k > elements.length || k <= 0) {
			return [];
		}

		if (k == elements.length) {
			return [elements];
		}

		if (k == 1) {
			for (i = 0; i < elements.length; i++) {
				combs.push([elements[i]]);
			}
			return combs;
		}

		for (i = 0; i < elements.length - k + 1; i++) {
			head = elements.slice(i, i + 1);
			tailcombs = this.k_combinations(elements.slice(i + 1), k - 1);
			for (j = 0; j < tailcombs.length; j++) {
				combs.push(head.concat(tailcombs[j]));
			}
		}
		return combs;
	}

	public getPossibleCombinationsOfMultiDimensionalArray<T> (arr: T[][]): T[][] {
		const r: T[][] = [], max = arr.length-1;

		function helper(inner: T[], i: number) {
			for (let j=0, l=arr[i].length; j<l; j++) {
				var a = inner.slice(0); // clone arr
				a.push(arr[i][j]);
				if (i==max)
					r.push(a);
				else
					helper(a, i+1);
			}
		}
		helper([], 0);
		return r;
	}
}