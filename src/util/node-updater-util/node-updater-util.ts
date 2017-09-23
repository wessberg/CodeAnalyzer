import {INodeUpdaterUtil} from "./i-node-updater-util";
import {Node, SourceFile} from "typescript";
import {INodeMatcherUtil} from "../node-matcher-util/i-node-matcher-util";
import {IPredicateUtil} from "../predicate-util/i-predicate-util";
import {IPrinter} from "../../ast/printer/i-printer";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

/**
 * A class that helps with updating (mutating) nodes in-place
 */
export class NodeUpdaterUtil implements INodeUpdaterUtil {
	/**
	 * The Set of keys that cannot be replaced
	 * @type {Set<string>}
	 */
	private static readonly NON_REPLACEABLE_KEYS = new Set<string>(["parent"]);

	constructor (private printer: IPrinter,
							 private languageService: ITypescriptLanguageService,
							 private nodeMatcherUtil: INodeMatcherUtil,
							 private predicateUtil: IPredicateUtil) {
	}

	/**
	 * Updates a Node in-place. This means it will be deep-mutated
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	public updateInPlace<T extends Node> (newNode: T, existing: T): T {

		// Perform an in-place update of the Node
		this.updateNodeInPlace(newNode, existing);

		// Get the SourceFile
		const sourceFile = existing.getSourceFile();
		if (sourceFile != null) {

			// Update the SourceFile
			this.updateSourceFileInPlace(sourceFile);
		}
		return existing;
	}

	/**
	 * Updates a value in-place
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {Set<Node>} seenNodes
	 * @param {string | number} keyOrIndex
	 * @param {boolean} [onlyPosition=false]
	 * @param {string | number} newNodeIndex
	 */
	private updateValueInPlace<T> (newNode: T, existing: T, seenNodes: Set<Node>, keyOrIndex: keyof T|number, onlyPosition: boolean = false, newNodeIndex: keyof T|number = keyOrIndex): void {
		const key = <keyof T> keyOrIndex;
		const newNodeKey = <keyof T> newNodeIndex;
		const existingValue = existing[key];
		const newValue = newNode[newNodeKey];
		const supportsKey = !onlyPosition || key === "pos" || key === "end";

		// Check if the new value is an array
		if (Array.isArray(newValue)) {

			// If it is, check if the existing value is an array too
			if (Array.isArray(existingValue)) {
				newValue.forEach((part, index) => {
					const closestIndex = this.nodeMatcherUtil.matchIndex(part, existingValue);
					if (closestIndex >= 0) {
						this.updateValueInPlace(newValue, existingValue, seenNodes, closestIndex, onlyPosition, index);
					} else {
						// Add to array!
						if (supportsKey) {
							existingValue.push(part);
						}
					}
				});
			}

			// Otherwise, set the value directly on the existing node
			else if (supportsKey) {
				existing[key] = newValue;
			}
		}

		// Check if the new value is a node
		else if (this.predicateUtil.isNode(newValue)) {

			// If it is, check if the existing value is a node too
			if (this.predicateUtil.isNode(existingValue)) {

				// If it is, check if it has been seen previously (in which case it is a circular reference)
				if (!seenNodes.has(newValue)) {
					// If it hasn't, merge recursively
					seenNodes.add(newValue);
					this.updateNodeInPlace(newValue, existingValue, seenNodes, onlyPosition);
				}
			}

			// Otherwise, set the value directly on the existing node
			else if (supportsKey) {
				existing[key] = newValue;
			}
		}

		// Otherwise, set the value if it is not null or if it is but is not part of the set of non-replaceable keys
		else if (supportsKey && (newValue != null || !NodeUpdaterUtil.NON_REPLACEABLE_KEYS.has(key))) {
			existing[key] = newValue;
		}
	}

	/**
	 * Updates a Node in-place. This means that it will be deep-mutated
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {Set<Node>} seenNodes
	 * @param {boolean} [onlyPosition=false]
	 * @returns {T}
	 */
	private updateNodeInPlace<T extends Node> (newNode: T, existing: T, seenNodes: Set<Node> = new Set(), onlyPosition: boolean = false): T {
		// Update each of the keys
		Object.keys(newNode).forEach((key: keyof T) => this.updateValueInPlace(newNode, existing, seenNodes, key, onlyPosition));

		// Return the (mutated) existing node
		return existing;
	}

	/**
	 * Updates a SourceFile in-place
	 * @param {SourceFile} sourceFile
	 * @returns {SourceFile}
	 */
	private updateSourceFileInPlace (sourceFile: SourceFile): SourceFile {
		const content = this.printer.print(sourceFile);
		const path = sourceFile.fileName;

		// Generate a new source file through the LanguageService
		const newSourceFile = this.languageService.addFile({path, content});
		console.log(this.printer.print(newSourceFile));
		return this.updateNodeInPlace(newSourceFile, sourceFile, undefined, true);
	}
}