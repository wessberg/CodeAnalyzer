import {Expression, Node, Statement, SyntaxKind} from "typescript";
import {isSourceFile} from "../predicate/PredicateFunctions";
import {ISourceFileProperties} from "../service/interface/ICodeAnalyzer";
import {ISourceFilePropertiesGetter} from "./interface/ISourceFilePropertiesGetter";

export class SourceFilePropertiesGetter implements ISourceFilePropertiesGetter {
	/**
	 * Walks up the inheritance chain from the given statement until it finds a SourceFile and returns an ISourceFileProperties object.
	 * @param {Statement} statement
	 * @returns {ISourceFileProperties}
	 */
	public getSourceFileProperties (statement: Statement|Node|Expression): ISourceFileProperties {
		let current: Statement|Node = statement;

		while (!isSourceFile(current)) {
			if (current.parent == null) break;
			current = current.parent;
		}

		if (!isSourceFile(current)) {
			throw new TypeError(`${this.getSourceFileProperties.name} could not find a source file from a given statement of kind ${SyntaxKind[statement.kind]}`);
		}

		return {
			filePath: current.fileName,
			fileContents: current.text
		};
	}
}