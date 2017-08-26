import {IInterfaceTypeMemberFormatter} from "./i-interface-type-member-formatter";
import {InterfaceProperty} from "../interface-type-formatter/interface-property";
import {IndexSignatureDeclaration, isComputedPropertyName, ParameterDeclaration, PropertySignature} from "typescript";
import {IInterfaceTypeMember, InterfaceTypeMemberNameKind, TypeKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for formatting InterfaceTypeMembers
 */
export class InterfaceTypeMemberFormatter implements IInterfaceTypeMemberFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats an InterfaceProperty, PropertySignature or IndexSignatureDeclaration into an IInterfaceTypeMember
	 * @param {InterfaceProperty | PropertySignature | IndexSignatureDeclaration | ParameterDeclaration} member
	 * @returns {IInterfaceTypeMember}
	 */
	public format (member: InterfaceProperty|PropertySignature|IndexSignatureDeclaration|ParameterDeclaration): IInterfaceTypeMember {
		const name = this.astUtil.takeName(member.name);
		const property = {
			optional: member.questionToken != null,
			type: this.typeFormatter().format(member)
		};

		let interfaceTypeMember: IInterfaceTypeMember;

		// Names of interfaces can only by symbols if they are computed - otherwise they will be static
		if (member.name != null && isComputedPropertyName(member.name)) {
			interfaceTypeMember = {
				...property,
				name: {
					kind: InterfaceTypeMemberNameKind.BUILT_IN_SYMBOL,
					name
				}
			};
		} else {
			interfaceTypeMember = {
				...property,
				name: {
					kind: InterfaceTypeMemberNameKind.STATIC,
					name
				}
			};
		}
		// Override the 'toString()' method
		interfaceTypeMember.toString = () => this.stringify(interfaceTypeMember);
		return interfaceTypeMember;
	}

	/**
	 * Generates a string representation of the IInterfaceType
	 * @param {IInterfaceTypeMember} interfaceTypeMember
	 * @returns {string}
	 */
	private stringify (interfaceTypeMember: IInterfaceTypeMember): string {
		let str = "";
		const isFunction = interfaceTypeMember.type.kind === TypeKind.FUNCTION;
		const isIndex = interfaceTypeMember.type.kind === TypeKind.INDEX;
		// Start with the name
		str += interfaceTypeMember.name.kind === InterfaceTypeMemberNameKind.BUILT_IN_SYMBOL ? `[${interfaceTypeMember.name.name}]` : interfaceTypeMember.name.name;
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