import {INodeToDictMapper} from "./i-node-to-dict-mapper";
import {IImportClauseDict} from "../dict/import-clause/i-import-clause-dict";
import {ImportClause, ImportSpecifier, isNamespaceImport} from "typescript";
import {INamedImportDict} from "../dict/named-import/i-named-import-dict";

/**
 * A class that can map nodes to dicts
 */
export class NodeToDictMapper implements INodeToDictMapper {

	/**
	 * Maps an ImportSpecifier to an INamedImportDict
	 * @param {ImportSpecifier?} node
	 * @returns {INamedImportDict?}
	 */
	public toNamedImportDict (node: ImportSpecifier|undefined): INamedImportDict|undefined {
		if (node == null) return undefined;

		return {
			name: node.name.text,
			propertyName: node.propertyName == null ? null : node.propertyName.text
		};
	}

	/**
	 * Maps an ImportClause to an IImportClauseDict
	 * @param {ImportClause?} node
	 * @returns {IImportClauseDict?}
	 */
	public toImportClauseDict (node: ImportClause|undefined): IImportClauseDict|undefined {
		if (node == null) return undefined;

		return {
			defaultName: node.name == null ? null : node.name.text,
			namespace: node.namedBindings == null || !isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.name.text,
			namedImports: node.namedBindings == null || isNamespaceImport(node.namedBindings)
				? null
				: node.namedBindings.elements.map(element => this.toNamedImportDict(element)!)
		};
	}

}