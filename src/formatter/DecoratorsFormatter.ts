import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {DecoratorIndexer, IDecorator, IdentifierMapKind} from "../service/interface/ICodeAnalyzer";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";

export class DecoratorsFormatter implements IDecoratorsFormatter {

	constructor (private mapper: IMapper, private nameGetter: INameGetter) {
	}

	/**
	 * Formats the decorators of the given declaration and returns a DecoratorIndexer.
	 * @param {PropertyDeclaration|ClassDeclaration|MethodDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction} declaration
	 * @returns {DecoratorIndexer}
	 */
	public format (declaration: PropertyDeclaration|ClassDeclaration|MethodDeclaration|ConstructorDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction): DecoratorIndexer {
		const obj: DecoratorIndexer = {};
		if (declaration.decorators == null) return obj;

		declaration.decorators.forEach(decorator => {
			const name = <string>this.nameGetter.getNameOfMember(decorator.expression, false, true);

			const map: IDecorator = {
				___kind: IdentifierMapKind.DECORATOR,
				startsAt: decorator.pos,
				endsAt: decorator.end,
				name
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.DECORATOR,
				enumerable: false
			});

			this.mapper.set(map, decorator);
			obj[name] = map;
		});
		return obj;
	}
}