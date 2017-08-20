import {IReferenceTypeFormatter} from "./i-reference-type-formatter";
import {IReferenceType, TypeKind} from "@wessberg/type";
import {HeritageClause} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";

/**
 * A class for generating IReferenceTypes
 */
export class ReferenceTypeFormatter implements IReferenceTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private typeFormatter: ITypeFormatter,
							 private interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter,
							 private parameterTypeFormatter: IParameterTypeFormatter) {}

	/**
	 * Formats the provided HeritageClause into an IReferenceType
	 * @param {ts.HeritageClause} heritageClause
	 * @returns {IReferenceType[]}
	 */
	public format (heritageClause: HeritageClause): IReferenceType[] {
		const referenceTypes: IReferenceType[] = [];

		heritageClause.types.forEach(type => {
			referenceTypes.push({
				kind: TypeKind.REFERENCE,
				name: this.astUtil.takeName(type.expression),
				typeArguments: type.typeArguments == null ? [] : type.typeArguments.map(typeArgument => this.typeFormatter.format(typeArgument, this.interfaceTypeMemberFormatter, this.parameterTypeFormatter))
			});
		});
		return referenceTypes;
	}

}