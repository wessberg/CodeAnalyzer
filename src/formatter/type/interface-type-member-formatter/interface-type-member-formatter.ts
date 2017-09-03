import {IInterfaceTypeMemberFormatter} from "./i-interface-type-member-formatter";
import {InterfaceProperty} from "../interface-type-formatter/interface-property";
import {IndexSignatureDeclaration, isComputedPropertyName, ParameterDeclaration, PropertySignature} from "typescript";
import {IFormattedInterfaceTypeMember, FormattedInterfaceTypeMemberNameKind, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for formatting InterfaceTypeMembers
 */
export class InterfaceTypeMemberFormatter extends FormattedExpressionFormatter implements IInterfaceTypeMemberFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats an InterfaceProperty, PropertySignature or IndexSignatureDeclaration into an IInterfaceTypeMember
	 * @param {InterfaceProperty | PropertySignature | IndexSignatureDeclaration | ParameterDeclaration} expression
	 * @returns {IFormattedInterfaceTypeMember}
	 */
	public format (expression: InterfaceProperty|PropertySignature|IndexSignatureDeclaration|ParameterDeclaration): IFormattedInterfaceTypeMember {
		const name = this.astUtil.takeName(expression.name);
		const property = {
			...super.format(expression),
			optional: expression.questionToken != null,
			type: this.typeFormatter().format(expression)
		};

		let interfaceTypeMember: IFormattedInterfaceTypeMember;

		// Names of interfaces can only by symbols if they are computed - otherwise they will be static
		if (expression.name != null && isComputedPropertyName(expression.name)) {
			interfaceTypeMember = {
				...property,
				name: {
					...super.format(expression.name),
					kind: FormattedInterfaceTypeMemberNameKind.BUILT_IN_SYMBOL,
					name,
					expressionKind: FormattedExpressionKind.TYPE_MEMBER_NAME
				},
				expressionKind: FormattedExpressionKind.INTERFACE_MEMBER
			};
		} else {
			interfaceTypeMember = {
				...property,
				name: {
					...super.format(expression.name!),
					kind: FormattedInterfaceTypeMemberNameKind.STATIC,
					name,
					expressionKind: FormattedExpressionKind.TYPE_MEMBER_NAME
				},
				expressionKind: FormattedExpressionKind.INTERFACE_MEMBER
			};
		}

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(interfaceTypeMember, expression);

		// Override the 'toString()' method
		interfaceTypeMember.toString = () => this.stringify(interfaceTypeMember);
		return interfaceTypeMember;
	}

	/**
	 * Generates a string representation of the IInterfaceType
	 * @param {IFormattedInterfaceTypeMember} interfaceTypeMember
	 * @returns {string}
	 */
	private stringify (interfaceTypeMember: IFormattedInterfaceTypeMember): string {
		let str = "";
		const isFunction = interfaceTypeMember.type.kind === FormattedTypeKind.FUNCTION;
		const isIndex = interfaceTypeMember.type.kind === FormattedTypeKind.INDEX;
		// Start with the name
		str += interfaceTypeMember.name.kind === FormattedInterfaceTypeMemberNameKind.BUILT_IN_SYMBOL ? `[${interfaceTypeMember.name.name}]` : interfaceTypeMember.name.name;
		// Add the '?' token after the name if the member is optional
		if (interfaceTypeMember.optional) str += "?";

		// Add a colon unless the property is a function.
		if (!isFunction && !isIndex) str += ":";
		// Add a single whitespace.
		if (!isIndex) str += " ";

		// Stringify the type
		str += interfaceTypeMember.type.toString();
		return str;
	}
}