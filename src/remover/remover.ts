import {IRemoverBase} from "./i-remover";
import {IUpdater} from "../updater/i-updater-getter";
import {ClassDeclaration, ClassElement, ClassExpression, Decorator, Node} from "typescript";
import {IFormatter} from "../formatter/i-formatter-getter";

/**
 * A class that can remove Nodes
 */
export class Remover implements IRemoverBase {

	constructor (private readonly formatter: IFormatter,
							 private readonly updater: IUpdater) {
	}

	/**
	 * Removes all of the provided ClassElements from the provided ClassDeclaration. If none is provided,
	 * all members will be removed
	 * @param {Iterable<ClassElement>} classElements
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeClassDeclarationMembers (classDeclaration: ClassDeclaration|ClassExpression, classElements?: Iterable<ClassElement>): boolean {
		const members = classElements == null ? classDeclaration.members : [...classElements];
		const filtered = this.formatter.formatNodeArray(classDeclaration.members.filter(member => !members.includes(member)));
		this.updater.updateClassDeclarationMembers(filtered, classDeclaration);
		return filtered.length > 0;
	}

	/**
	 * Removes all decorators from the provided Node. If no decorators are provided, all of them will be removed
	 * @param {T} node
	 * @param {Iterable<Decorator>} decorators
	 * @returns {boolean}
	 */
	public removeDecorators<T extends Node> (node: T, decorators?: Iterable<Decorator>): boolean {
		// If no decorators are provided, use the existing decorators of the node. Otherwise, create an array of all the provided decorators to be removed
		const members = decorators == null ? node.decorators : [...decorators];

		const filtered = node.decorators == null ? undefined : this.formatter.formatNodeArray(node.decorators.filter(member => members == null ? false : !members.includes(member)));
		const lastAmount = node.decorators == null ? 0 : node.decorators.length;

		this.updater.updateNodeDecorators(filtered, node);

		const newAmount = node.decorators == null ? 0 : node.decorators.length;

		// If the new amount of decorators is less than the last amount, some decorators were removed
		return newAmount < lastAmount;
	}

}