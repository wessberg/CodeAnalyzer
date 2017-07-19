import {Declaration, Expression, Node, ParameterDeclaration, Statement, SyntaxKind, TypeAliasDeclaration, TypeNode} from "typescript";
import {isArrayTypeNode, isExpressionWithTypeArguments, isIdentifierObject, isIndexedAccessTypeNode, isIndexSignatureDeclaration, isIntersectionTypeNode, isPropertySignature, isThisTypeNode, isTupleTypeNode, isTypeLiteralNode, isTypeNode, isTypeReference, isTypeReferenceNode, isUnionTypeNode} from "../predicate/PredicateFunctions";
import {ITypeExpressionGetter} from "./interface/ITypeExpressionGetter";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {nameGetter, sourceFilePropertiesGetter, tokenSerializer, valueExpressionGetter} from "../services";
import {TypeExpression} from "../identifier/interface/IIdentifier";

/**
 * A class that helps with getting value expressions for type expressions.
 */
export class TypeExpressionGetter implements ITypeExpressionGetter {

	/**
	 * Tokenizes the type information from the given statement and returns a TypeExpression.
	 * @param {ParameterDeclaration|TypeAliasDeclaration|TypeNode} statement
	 * @returns {TypeExpression}
	 */
	public getTypeExpression (statement: ParameterDeclaration|TypeAliasDeclaration|TypeNode): TypeExpression {

		if (isIndexedAccessTypeNode(statement)) {
			return [...this.getTypeExpression(statement.objectType), "[", ...this.getTypeExpression(statement.indexType), "]"];
		}

		if (isThisTypeNode(statement)) {
			return ["this"];
		}

		if (isTypeNode(statement)) {
			if ((isTypeReferenceNode(statement) || isTypeReference(statement)) && isIdentifierObject(statement.typeName)) {
				const name = statement.typeName.text;
				let typeArguments: TypeExpression|null = null;
				const typeArgs = statement.typeArguments;

				if (typeArgs != null) {
					typeArgs.forEach((typeArgument, index) => {
						const value = this.getTypeExpression(typeArgument);
						value.forEach(part => {
							if (typeArguments == null) typeArguments = [];
							typeArguments.push(part);
							if (index !== typeArgs.length - 1) typeArguments.push(", ");
						});
					});
				}
				return [{name, typeArguments}];
			}

			if (isArrayTypeNode(statement)) {
				return [...this.getTypeExpression(statement.elementType), "[", "]"];
			}

			if (isTupleTypeNode(statement)) {
				const exp: TypeExpression = [];
				exp.push("[");

				statement.elementTypes.forEach((type, index) => {
					const value = this.getTypeExpression(type);
					value.forEach(part => exp.push(part));
					if (index !== statement.elementTypes.length - 1) exp.push(", ");
				});
				exp.push("]");
				return exp;
			}

			if (isIntersectionTypeNode(statement)) {
				const exp: TypeExpression = [];

				statement.types.forEach((intersectionType, index) => {
					const value = this.getTypeExpression(intersectionType);

					value.forEach(part => exp.push(part));
					if (index !== statement.types.length - 1) exp.push(" & ");
				});
				return exp;
			}

			if (isUnionTypeNode(statement)) {
				const exp: TypeExpression = [];

				statement.types.forEach((unionType, index) => {
					const value = this.getTypeExpression(unionType);

					value.forEach(part => exp.push(part));
					if (index !== statement.types.length - 1) exp.push("|");
				});
				return exp;
			}

			return [tokenSerializer.serializeToken(statement.kind, statement)];
		}

		if (isTypeLiteralNode(statement)) {
			const exp: TypeExpression = ["{"];

			statement.members.forEach((member, index) => {

				if (isIndexSignatureDeclaration(member)) {
					exp.push("[");

					member.parameters.forEach(parameter => {
						exp.push(<string>nameGetter.getNameOfMember(parameter.name, false, true));
						if (parameter.type != null) {
							exp.push(": ");
							const type = this.getTypeExpression(parameter.type);
							type.forEach(part => exp.push(part));
						}
						exp.push("]");

					});
					if (member.type != null) {
						exp.push(": ");
						const type = this.getTypeExpression(member.type);
						type.forEach(part => exp.push(part));
					}
				}

				if (isPropertySignature(member)) {
					const name = <string>nameGetter.getNameOfMember(member.name, false, true);
					const type = member.type == null ? null : this.getTypeExpression(member.type);
					exp.push(name);

					if (member.questionToken != null) {
						exp.push(tokenSerializer.serializeToken(member.questionToken.kind, member.questionToken));
					}
					if (type != null) {
						exp.push(": ");
						type.forEach(part => exp.push(part));
					}
				}

				if (index !== statement.members.length - 1) exp.push(", ");

			});
			exp.push("}");
			return exp;
		}

		if (isTypeReference(statement)) {
			const name = this.getFlattenedName(statement.typeName);
			let typeArguments: TypeExpression|null = null;
			const typeArgs = statement.typeArguments;
			if (typeArgs != null) {
				typeArgs.forEach((typeArgument, index) => {
					const value = this.getTypeExpression(typeArgument);
					value.forEach(part => {
						if (typeArguments == null) typeArguments = [];
						typeArguments.push(part);
						if (index !== typeArgs.length - 1) typeArguments.push(", ");
					});
				});
			}
			return [{name, typeArguments}];
		}

		if (isExpressionWithTypeArguments(statement)) {
			const name = nameGetter.getNameOfMember(statement.expression, false, true);
			let typeArguments: TypeExpression|null = null;
			const typeArgs = statement.typeArguments;
			if (typeArgs != null) {
				typeArgs.forEach((typeArgument, index) => {
					const value = this.getTypeExpression(typeArgument);
					value.forEach(part => {
						if (typeArguments == null) typeArguments = [];
						typeArguments.push(part);
						if (index !== typeArgs.length - 1) typeArguments.push(", ");
					});
				});
			}
			return [{name, typeArguments}];
		}

		if (statement.type != null) return this.getTypeExpression(statement.type);
		throw new TypeError(`${this.getTypeExpression.name} could not retrieve the type information for a statement of kind ${SyntaxKind[statement.kind]} around here: ${sourceFilePropertiesGetter.getSourceFileProperties(statement).fileContents.slice(statement.pos, statement.end)}`);
	}

	/**
	 * Gets the flattened name for a type. Takes all the type value expressions and stringifies them.
	 * @param {Statement | Expression | Declaration | Node} statement
	 * @returns {string}
	 */
	private getFlattenedName (statement: Statement|Expression|Declaration|Node): string {
		const expression = valueExpressionGetter.getValueExpression(statement);
		return expression.map(exp => exp instanceof BindingIdentifier ? exp.name : exp).join("");
	}
}