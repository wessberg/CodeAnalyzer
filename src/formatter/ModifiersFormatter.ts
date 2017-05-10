import {ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration, VariableDeclaration, VariableStatement} from "typescript";
import {isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../PredicateFunctions";
import {serializeToken} from "../Util";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";

export class ModifiersFormatter implements IModifiersFormatter {

	public format (statement: VariableDeclaration | VariableStatement | PropertyDeclaration | MethodDeclaration | FunctionDeclaration | ClassDeclaration): Set<string> {
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
		return new Set(statement.modifiers == null ? [] : statement.modifiers.map(modifier => <string>serializeToken(modifier.kind)));
	}
}