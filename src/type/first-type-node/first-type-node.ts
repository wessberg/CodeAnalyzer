/*tslint:disable*/
import {Identifier, SyntaxKind, TypeNode} from "typescript";

/**
 * The Typescript library doesn't include an interface declaration for FirstTypeNodes
 */
export interface FirstTypeNode extends TypeNode {
	/*tslint:enable*/
	kind: SyntaxKind.FirstTypeNode;
	parameterName: Identifier;
	type: TypeNode;
}