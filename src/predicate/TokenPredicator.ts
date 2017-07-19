import {ITokenPredicator} from "./interface/ITokenPredicator";
import {ArbitraryValue} from "../identifier/interface/IIdentifier";

/**
 * A class that gives relevant meta-information about arbitrary values.
 * For example, if the item is a keyword, whitespace or an operator.
 */
export class TokenPredicator implements ITokenPredicator {

	/**
	 * Returns true if the given item is a stringified keyword or a stringified operator.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public isTokenLike (item: ArbitraryValue): boolean {
		return this.isWhitespace(item) || this.isKeywordLike(item) || this.isOperatorLike(item);
	}

	/**
	 * Returns true if the given item is a string of pure whitespace.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public isWhitespace (item: ArbitraryValue): boolean {
		if (typeof item !== "string") return false;
		return /^[\t\n\r\s]+$/.test(item);
	}

	/**
	 * Returns true if the given token expects an identifier. For example, '++' will throw exceptions
	 * if given a primitive value.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public throwsIfPrimitive (item: ArbitraryValue): boolean {
		switch (item == null ? "" : item.toString()) {
			case "=":
			case "++":
			case "--":
			case "+=":
			case "-=":
			case "*=":
			case "**=":
			case "...":
				return true;
			default:
				return false;
		}
	}

	/**
	 * Returns true if the given item is a stringified keyword.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public isKeywordLike (item: ArbitraryValue): boolean {
		switch (item == null ? "" : item.toString()) {
			case "object":
			case "number":
			case "never":
			case "boolean":
			case "any":
			case "void":
			case "symbol":
			case "null":
			case "undefined":
			case "string":
			case "true":
			case "false":
			case "break":
			case "catch":
			case "case":
			case "class":
			case "const":
			case "continue":
			case "debugger":
			case "default":
			case "delete":
			case "do":
			case "else":
			case "enum":
			case "export":
			case "extends":
			case "finally":
			case "for":
			case "function":
			case "if":
			case "import":
			case "in":
			case "instanceof":
			case "new":
			case "return":
			case "super":
			case "this":
			case "throw":
			case "try":
			case "typeof":
			case "var":
			case "with":
			case "implements":
			case "interface":
			case "let":
			case "package":
			case "private":
			case "protected":
			case "public":
			case "static":
			case "yield":
			case "abstract":
			case "as":
			case "async":
			case "await":
			case "constructor":
			case "declare":
			case "get":
			case "is":
			case "keyof":
			case "module":
			case "namespace":
			case "readonly":
			case "require":
			case "set":
			case "type":
			case "from":
			case "global":
			case "of":
				return true;
			default:
				return false;
		}
	}

	/**
	 * Returns true if the given item is a stringified operator.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public isOperatorLike (item: ArbitraryValue): boolean {
		switch (item == null ? "" : item.toString()) {
			case "+":
			case "-":
			case "=":
			case "=>":
			case "==":
			case "===":
			case "++":
			case "--":
			case "+=":
			case "-=":
			case "*":
			case "/":
			case "*=":
			case "**=":
			case "**":
			case "!==":
			case "!=":
			case "!":
			case "||":
			case "|":
			case "|=":
			case "&&":
			case "&":
			case "&=":
			case "%":
			case "/=":
			case "</":
			case "%=":
			case ":":
			case ";":
			case "<=":
			case ">":
			case "<":
			case "<<=":
			case "<<":
			case ">=":
			case ">>=":
			case ">>>":
			case "<<<":
			case ">>":
			case ">>>=":
			case "?":
			case "~":
			case "^":
			case "^=":
			case ",":
			case "{":
			case "}":
			case "(":
			case ")":
			case "[":
			case "]":
			case ".":
			case "...":
				return true;
			default:
				return false;
		}
	}
}