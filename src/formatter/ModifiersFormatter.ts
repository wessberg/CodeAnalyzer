import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration, VariableDeclaration, VariableStatement} from "typescript";
import {isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../predicate/PredicateFunctions";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {tokenSerializer} from "../services";

/**
 * A class that can format modifiers for all relevant kinds of statements.
 */
export class ModifiersFormatter implements IModifiersFormatter {

	/**
	 * Formats the given statement and returns a Set of modifier names,
	 * @param {VariableDeclaration | VariableStatement | PropertyDeclaration | MethodDeclaration | FunctionDeclaration | ClassDeclaration | ConstructorDeclaration | ArrowFunction | GetAccessorDeclaration | SetAccessorDeclaration} statement
	 * @returns {Set<string>}
	 */
	public format (statement: VariableDeclaration|VariableStatement|PropertyDeclaration|MethodDeclaration|FunctionDeclaration|ClassDeclaration|ConstructorDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): Set<string> {
		if (isVariableDeclaration(statement) && statement.modifiers == null) {
			const parent = statement.parent;
			if (parent != null && isVariableDeclarationList(parent)) {
				const parentsParent = parent.parent;
				if (parentsParent != null && isVariableStatement(parentsParent)) {
					return this.format(parentsParent);
				}
			} else if (parent != null && isVariableStatement(parent)) {
				return this.format(parent);
			}

		}
		return new Set(statement.modifiers == null ? [] : statement.modifiers.map(modifier => <string>tokenSerializer.serializeToken(modifier.kind, modifier)));
	}
}