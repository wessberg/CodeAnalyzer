import {PropertyDeclaration} from "typescript";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {IPropFormatter} from "./interface/IPropFormatter";
import {decoratorsFormatter, identifierUtil, mapper, modifiersFormatter, nameGetter, sourceFilePropertiesGetter, tokenSerializer, typeExpressionGetter, typeUtil, valueableFormatter} from "../services";
import {IdentifierMapKind, IPropDeclaration} from "../identifier/interface/IIdentifier";

/**
 * A class that can format props for all relevant kinds of statements
 */
export class PropFormatter implements IPropFormatter {

	/**
	 * Takes a PropertyDeclaration and returns an IPropDeclaration.
	 * @param {PropertyDeclaration} declaration
	 * @param {string} className
	 * @returns {IPropDeclaration}
	 */
	public format (declaration: PropertyDeclaration, className: string): IPropDeclaration {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const name = <string>nameGetter.getNameOfMember(declaration.name, false, true);
		const typeExpression = declaration.type == null ? null : typeExpressionGetter.getTypeExpression(declaration.type);
		const typeFlattened = typeExpression == null ? null : tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : typeUtil.takeTypeBindings(typeExpression);
		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;

		const value = valueableFormatter.format(declaration, undefined, declaration.initializer);

		const map: IPropDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.PROP,
			isStatic,
			modifiers: modifiersFormatter.format(declaration),
			startsAt,
			endsAt,
			name,
			filePath,
			className,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			},
			decorators: decoratorsFormatter.format(declaration),
			value
		}, IdentifierMapKind.PROP);

		mapper.set(map, declaration);
		return map;
	}

}