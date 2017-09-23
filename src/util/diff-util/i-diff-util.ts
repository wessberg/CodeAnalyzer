export interface IDiffUtil {
	/*tslint:disable:no-any*/
	takeDiff (a: any, b: any): number;
	findClosestMatchingIndexInArray (part: any, existingLength: number, b: any[]): number;
	/*tslint:enable:no-any*/
}