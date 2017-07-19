import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration} from "typescript";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {identifierUtil, mapper, nameGetter} from "../services";
import {IDecorator, IDecoratorIndexer, IdentifierMapKind} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IDecoratorIndexer
 */
export class DecoratorsFormatter implements IDecoratorsFormatter {

	/**
	 * Formats the decorators of the given declaration and returns a IDecoratorIndexer.
	 * @param {PropertyDeclaration|ClassDeclaration|MethodDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration} declaration
	 * @returns {IDecoratorIndexer}
	 */
	public format (declaration: PropertyDeclaration|ClassDeclaration|MethodDeclaration|ConstructorDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction|SetAccessorDeclaration|GetAccessorDeclaration): IDecoratorIndexer {
		const obj: IDecoratorIndexer = {};
		if (declaration.decorators == null) return obj;

		declaration.decorators.forEach(decorator => {
			const name = <string>nameGetter.getNameOfMember(decorator.expression, false, true);

			const map: IDecorator = identifierUtil.setKind({
				___kind: IdentifierMapKind.DECORATOR,
				startsAt: decorator.pos,
				endsAt: decorator.end,
				name
			}, IdentifierMapKind.DECORATOR);

			mapper.set(map, decorator);
			obj[name] = map;
		});
		return obj;
	}
}