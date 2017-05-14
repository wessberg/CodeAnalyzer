import {TypeExpression} from "src/service/interface/ICodeAnalyzer";
import {ParameterDeclaration, SyntaxKind, TypeAliasDeclaration, TypeNode} from "typescript";
import {isArrayTypeNode, isExpressionWithTypeArguments, isIdentifierObject, isIndexSignatureDeclaration, isIntersectionTypeNode, isPropertySignature, isTupleTypeNode, isTypeLiteralNode, isTypeNode, isTypeReference, isTypeReferenceNode, isUnionTypeNode} from "../predicate/PredicateFunctions";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {INameGetter} from "./interface/INameGetter";
import {ITypeExpressionGetter} from "./interface/ITypeExpressionGetter";

export class TypeExpressionGetter implements ITypeExpressionGetter {

	constructor (private nameGetter: INameGetter, private tokenSerializer: ITokenSerializer) {
	}

	/**
	 * Tokenizes the type information from the given statement and returns a TypeExpression.
	 * @param {ParameterDeclaration|TypeAliasDeclaration|TypeNode} statement
	 * @returns {TypeExpression}
	 */
	public getTypeExpression (statement: ParameterDeclaration|TypeAliasDeclaration|TypeNode): TypeExpression {

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

			return [this.tokenSerializer.serializeToken(statement.kind)];
		}

		if (isTypeLiteralNode(statement)) {
			const exp: TypeExpression = ["{"];

			statement.members.forEach((member, index) => {

				if (isIndexSignatureDeclaration(member)) {
					exp.push("[");

					member.parameters.forEach(parameter => {
						exp.push(<string>this.nameGetter.getNameOfMember(parameter.name, false, true));
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
					const name = <string>this.nameGetter.getNameOfMember(member.name, false, true);
					const type = member.type == null ? null : this.getTypeExpression(member.type);
					exp.push(name);

					if (member.questionToken != null) {
						exp.push(this.tokenSerializer.serializeToken(member.questionToken.kind));
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

		if (isTypeReference(statement) && isIdentifierObject(statement.typeName)) {
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

		if (isExpressionWithTypeArguments(statement)) {
			const name = this.nameGetter.getNameOfMember(statement.expression, false, true);
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
		throw new TypeError(`${this.getTypeExpression.name} could not retrieve the type information for a statement of kind ${SyntaxKind[statement.kind]}`);
	}
}