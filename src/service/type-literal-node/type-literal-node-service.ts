import {TypeDeclarationService} from "../type-declaration/type-declaration-service";
import {SyntaxKind, TypeLiteralNode} from "typescript";
import {ITypeLiteralNodeService} from "./i-type-literal-node-service";

/**
 * A service for working with TypeLiteralNodes
 */
export class TypeLiteralNodeService extends TypeDeclarationService<TypeLiteralNode> implements ITypeLiteralNodeService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.TypeLiteral];
}