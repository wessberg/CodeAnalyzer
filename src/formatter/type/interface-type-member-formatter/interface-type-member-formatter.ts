import {IInterfaceTypeMemberFormatter} from "./i-interface-type-member-formatter";
import {InterfaceProperty} from "../interface-type-formatter/interface-property";
import {IndexSignatureDeclaration, isComputedPropertyName, PropertySignature} from "typescript";
import {IInterfaceTypeMember, InterfaceTypeMemberNameKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";

/**
 * A class for formatting InterfaceTypeMembers
 */
export class InterfaceTypeMemberFormatter implements IInterfaceTypeMemberFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private parameterTypeFormatter: IParameterTypeFormatter,
							 private typeFormatter: ITypeFormatter) {}

	/**
	 * Formats an InterfaceProperty, PropertySignature or IndexSignatureDeclaration into an IInterfaceTypeMember
	 * @param {InterfaceProperty | PropertySignature | IndexSignatureDeclaration} member
	 * @returns {IInterfaceTypeMember}
	 */
	public format (member: InterfaceProperty|PropertySignature|IndexSignatureDeclaration): IInterfaceTypeMember {
		const name = this.astUtil.takeName(member.name);
		const property = {
			optional: member.questionToken != null,
			type: this.typeFormatter.format(member.type, this, this.parameterTypeFormatter)
		};

		// Names of interfaces can only by symbols if they are computed - otherwise they will be static
		if (member.name != null && isComputedPropertyName(member.name)) {
			return {
				...property,
				name: {
					kind: InterfaceTypeMemberNameKind.BUILT_IN_SYMBOL,
					name
				}
			};
		} else {
			return {
				...property,
				name: {
					kind: InterfaceTypeMemberNameKind.STATIC,
					name
				}
			};
		}
	}
}