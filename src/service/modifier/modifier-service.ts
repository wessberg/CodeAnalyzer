import {IModifierService} from "./i-modifier-service";
import {createNodeArray, Modifier, Node, NodeArray, SyntaxKind} from "typescript";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";
import {ModifierKind} from "../../dict/modifier/modifier-kind";
import {IFormatter} from "../../formatter/i-formatter-getter";

/**
 * A service that helps with Modifiers
 */
export class ModifierService implements IModifierService {

	constructor (private formatter: IFormatter) {
	}

	/**
	 * Returns true if the provided Node has a 'async' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isAsync (node: Node): boolean {
		return this.hasModifierWithName("async", node);
	}

	/**
	 * Returns true if the provided Node has a 'declare' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isDeclared (node: Node): boolean {
		return this.hasModifierWithName("declare", node);
	}

	/**
	 * Returns true if the provided Node has a 'default' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isDefault (node: Node): boolean {
		return this.hasModifierWithName("default", node);
	}

	/**
	 * Returns true if the provided Node has a 'private' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isPrivate (node: Node): boolean {
		return this.hasModifierWithName("private", node);
	}

	/**
	 * Returns true if the provided Node has a 'protected' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isProtected (node: Node): boolean {
		return this.hasModifierWithName("protected", node);
	}

	/**
	 * Returns true if the provided Node has a 'public' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isPublic (node: Node): boolean {
		return this.hasModifierWithName("public", node);
	}

	/**
	 * Returns true if the provided Node has a 'static' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isStatic (node: Node): boolean {
		return this.hasModifierWithName("static", node);
	}

	/**
	 * Returns true if the provided Node has a 'abstract' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isAbstract (node: Node): boolean {
		return this.hasModifierWithName("abstract", node);
	}

	/**
	 * Returns true if the provided Node has a 'readonly' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isReadonly (node: Node): boolean {
		return this.hasModifierWithName("readonly", node);
	}

	/**
	 * Returns true if the provided Node has a 'const' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isConst (node: Node): boolean {
		return this.hasModifierWithName("const", node);
	}

	/**
	 * Returns true if the provided Node has a 'export' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isExported (node: Node): boolean {
		return this.hasModifierWithName("export", node);
	}

	/**
	 * Returns true if the provided Node has a 'default' and 'export' modifier
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public isDefaultExported (node: Node): boolean {
		return this.isDefault(node) && this.isExported(node);
	}

	/**
	 * Creates a Modifier for visibility (either private, protected or public)
	 * @param {VisibilityKind} modifier
	 * @returns {Modifier}
	 */
	public createVisibilityModifier (modifier: VisibilityKind): Modifier {
		if (modifier === "private") {
			return this.createPrivateModifier();
		}

		else if (modifier === "protected") {
			return this.createProtectedModifier();
		}

		else {
			return this.createPublicModifier();
		}
	}

	/**
	 * Returns true if the provided node has a modifier with a name matching the provided one
	 * @param {string} name
	 * @param {Node} node
	 * @returns {boolean}
	 */
	public hasModifierWithName (name: string, node: Node): boolean {
		return node.modifiers != null && node.modifiers.some(modifier => this.getModifierName(modifier) === name);
	}

	/**
	 * Gets the name for a Modifier
	 * @param {Modifier} modifier
	 * @returns {string}
	 */
	public getModifierName (modifier: Modifier): string {
		if (modifier.kind === SyntaxKind.ConstKeyword) {
			return "const";
		}

		else if (modifier.kind === SyntaxKind.DeclareKeyword) {
			return "declare";
		}

		else if (modifier.kind === SyntaxKind.DefaultKeyword) {
			return "default";
		}

		else if (modifier.kind === SyntaxKind.ExportKeyword) {
			return "export";
		}

		else if (modifier.kind === SyntaxKind.ReadonlyKeyword) {
			return "readonly";
		}

		else if (modifier.kind === SyntaxKind.PrivateKeyword) {
			return "private";
		}

		else if (modifier.kind === SyntaxKind.ProtectedKeyword) {
			return "protected";
		}

		else if (modifier.kind === SyntaxKind.PublicKeyword) {
			return "public";
		}

		else if (modifier.kind === SyntaxKind.AsyncKeyword) {
			return "async";
		}

		else if (modifier.kind === SyntaxKind.StaticKeyword) {
			return "static";
		}

		else {
			return "abstract";
		}
	}

	/**
	 * Parses the provided string into a Modifier
	 * @param {ModifierKind} modifier
	 * @returns {Modifier}
	 */
	public createModifierFromString (modifier: ModifierKind): Modifier {
		return this.formatter.formatModifier(modifier);
	}

	/**
	 * Parses all of the provided modifier names into a NodeArray of modifiers
	 * @param {Iterable<ModifierKind>} modifiers
	 * @returns {NodeArray<Modifier>}
	 */
	public createModifiersFromStrings (modifiers: Iterable<ModifierKind>): NodeArray<Modifier> {
		return createNodeArray([...modifiers].map(modifier => this.createModifierFromString(modifier)));
	}

	/**
	 * Creates a modifier for a 'const' keyword
	 * @returns {Modifier}
	 */
	public createConstModifier (): Modifier {
		return this.formatter.formatModifier("const");
	}

	/**
	 * Creates a modifier for a 'declare' keyword
	 * @returns {Modifier}
	 */
	public createDeclareModifier (): Modifier {
		return this.formatter.formatModifier("declare");
	}

	/**
	 * Creates a modifier for a 'default' keyword
	 * @returns {Modifier}
	 */
	public createDefaultModifier (): Modifier {
		return this.formatter.formatModifier("default");
	}

	/**
	 * Creates a modifier for an 'export' keyword
	 * @returns {Modifier}
	 */
	public createExportModifier (): Modifier {
		return this.formatter.formatModifier("export");
	}

	/**
	 * Creates a modifier for a 'readonly' keyword
	 * @returns {Modifier}
	 */
	public createReadonlyModifier (): Modifier {
		return this.formatter.formatModifier("readonly");
	}

	/**
	 * Creates a modifier for a 'private' keyword
	 * @returns {Modifier}
	 */
	public createPrivateModifier (): Modifier {
		return this.formatter.formatModifier("private");
	}

	/**
	 * Creates a modifier for a 'public' keyword
	 * @returns {Modifier}
	 */
	public createPublicModifier (): Modifier {
		return this.formatter.formatModifier("public");
	}

	/**
	 * Creates a modifier for a 'protected' keyword
	 * @returns {Modifier}
	 */
	public createProtectedModifier (): Modifier {
		return this.formatter.formatModifier("protected");
	}

	/**
	 * Creates a modifier for an 'async' keyword
	 * @returns {Modifier}
	 */
	public createAsyncModifier (): Modifier {
		return this.formatter.formatModifier("async");
	}

	/**
	 * Creates a modifier for a 'static' keyword
	 * @returns {Modifier}
	 */
	public createStaticModifier (): Modifier {
		return this.formatter.formatModifier("static");
	}

	/**
	 * Creates a modifier for an 'abstract' keyword
	 * @returns {Modifier}
	 */
	public createAbstractModifier (): Modifier {
		return this.formatter.formatModifier("abstract");
	}
}