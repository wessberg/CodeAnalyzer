import {IPrinter} from "./i-printer";
import {createPrinter, NewLineKind, Node, NodeArray, Printer as TypescriptPrinter, SourceFile, SyntaxKind} from "typescript";

/**
 * A class that can print a SourceFile
 */
export class Printer implements IPrinter {
	/**
	 * Keys to discard when stringifying a Node
	 * @type {Set<string>}
	 */
	private static readonly DISCARD_KEYS = new Set(["parent", "flags", "transformFlags", "symbol", "identifiers", "classifiableNames", "lineMap", "modifierFlagsCache", "imports", "moduleAugmentations", "ambientModuleNames", "nextContainer", "locals", "scriptSnapshot", "symbolCount", "bindDiagnostics", "text", "languageVersion", "fileName", "languageVariant", "isDeclarationFile", "scriptKind", "referencedFiles", "typeReferenceDirectives", "amdDependencies", "path", "version", "parseDiagnostics", "nodeCount", "identifierCount", "endOfFileToken", "autoGenerateKind", "autoGenerateId", "original", "localSymbol"]);

	/**
	 * The spacing to use when stringifying a Node
	 * @type {string}
	 */
	private static readonly SPACING: string = "  ";

	/**
	 * A printer that can print a Typescript AST
	 * @type {Printer}
	 */
	private readonly printer: TypescriptPrinter = createPrinter({newLine: NewLineKind.LineFeed});

	/**
	 * Stringifies a Node in a compact, readable representation
	 * @param {Node|NodeArray<Node>} node
	 * @returns {string}
	 */
	public stringify (node: Node|NodeArray<Node>): string {
		return JSON.stringify(node, (key, value) => {
			if (key === "kind" || key === "token") return SyntaxKind[value];
			if (Printer.DISCARD_KEYS.has(key)) return undefined;
			return value;
		}, Printer.SPACING);
	}

	/**
	 * Prints a SourceFile
	 * @param {SourceFile} sourceFile
	 * @returns {string}
	 */
	public print (sourceFile: SourceFile): string {
		return this.printer.printFile(sourceFile);
	}
}