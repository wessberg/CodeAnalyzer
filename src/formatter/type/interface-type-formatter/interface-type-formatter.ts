import {IInterfaceTypeFormatter} from "./i-interface-type-formatter";
import {InterfaceProperty} from "./interface-property";
import {InterfaceDeclaration} from "typescript";
import {FormattedExpressionKind, IFormattedInterfaceType} from "@wessberg/type";
import {ReferenceTypeFormatterGetter} from "../reference-type-formatter/reference-type-formatter-getter";
import {InterfaceTypeMemberFormatterGetter} from "../interface-type-member-formatter/interface-type-member-formatter-getter";
import {TypeParameterFormatterGetter} from "../type-parameter-formatter/type-parameter-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {IdentifierFormatterGetter} from "../../expression/identifier/identifier-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for formatting IFormattedInterfaceType
 */
export class InterfaceTypeFormatter extends FormattedExpressionFormatter implements IInterfaceTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private identifierFormatter: IdentifierFormatterGetter,
							 private referenceTypeFormatter: ReferenceTypeFormatterGetter,
							 private interfaceTypeMemberFormatter: InterfaceTypeMemberFormatterGetter,
							 private typeParameterFormatter: TypeParameterFormatterGetter) {
		super();
	}

	/**
	 * Formats an InterfaceDeclaration into an IFormattedInterfaceType
	 * @param {InterfaceDeclaration} expression
	 * @returns {IFormattedInterfaceType}
	 */
	public format (expression: InterfaceDeclaration): IFormattedInterfaceType {

		const interfaceType: IFormattedInterfaceType = {
			...super.format(expression),
			file: expression.getSourceFile().fileName,
			name: this.identifierFormatter().format(expression.name),
			extends: expression.heritageClauses == null ? [] : expression.heritageClauses[0].types.map(node => this.referenceTypeFormatter().format(node)),
			typeParameters: expression.typeParameters == null ? [] : expression.typeParameters.map(typeParameter => this.typeParameterFormatter().format(typeParameter)),
			members: expression.members.map(member => this.interfaceTypeMemberFormatter().format(<InterfaceProperty>member)),
			expressionKind: FormattedExpressionKind.INTERFACE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(interfaceType, expression);

		// Override the 'toString()' method
		interfaceType.toString = () => this.stringify(interfaceType);
		return interfaceType;
	}

	/**
	 * Generates a string representation of the IFormattedInterfaceType
	 * @param {IFormattedInterfaceType} interfaceType
	 * @returns {string}
	 */
	private stringify (interfaceType: IFormattedInterfaceType): string {
		let str = `interface ${interfaceType.name.name}`;
		// Add the type parameters to it
		if (interfaceType.typeParameters.length > 0) {
			str += `<${interfaceType.typeParameters.map(typeParameter => typeParameter.toString()).join(", ")}>`;
		}

		// Add the 'extends' relation(s) to the interface
		if (interfaceType.extends.length > 0) {
			str += ` extends ${interfaceType.extends.map(extend => extend.toString()).join(", ")}`;
		}
		// Add the opening bracket.
		str += " {";

		// Add all of the members.
		str += interfaceType.members.map(member => `\n\t${member.toString()}`).join(";");
		// Add one last ';' if required.
		if (interfaceType.members.length > 0) str += ";";

		// Add the closing bracket.
		str += "\n}";
		return str;
	}
}