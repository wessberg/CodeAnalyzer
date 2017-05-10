import {BinaryOperator, NodeFlags, SyntaxKind, TypeNode} from "typescript";
import {BindingIdentifier} from "./BindingIdentifier";
import {IBindingIdentifier} from "./interface/IBindingIdentifier";
import {ArbitraryValue, ITypeBinding, TypeExpression} from "./interface/ISimpleLanguageService";
import {isTypeBinding} from "./PredicateFunctions";

/**
 * Formats and returns a string representation of a type.
 * @param {TypeExpression} expression
 * @returns {string}
 */
export function serializeTypeExpression (expression: TypeExpression): string {
	let statement: string = "";
	expression.forEach(token => {
		if (isTypeBinding(token)) {
			statement += token.name;
			if (token.typeArguments != null) {
				statement += `<${serializeTypeExpression(token.typeArguments)}>`;
			}
		} else {
			statement += `${token}`;
		}
	});
	return statement;
}

/**
 * Checks the token and returns the appropriate native version if possible, otherwise it returns the serialized version.
 * @param {SyntaxKind} token
 * @returns {ArbitraryValue}
 */
export function marshalToken (token: SyntaxKind | BinaryOperator | TypeNode): ArbitraryValue {
	switch (token) {
		case SyntaxKind.NullKeyword:
			return null;
		case SyntaxKind.UndefinedKeyword:
			return undefined;
		case SyntaxKind.TrueKeyword:
			return true;
		case SyntaxKind.FalseKeyword:
			return false;
		default:
			return serializeToken(token);
	}
}

/**
 * Serializes the given flag and returns the textual representation of it.
 * @param {NodeFlags} flag
 * @returns {string|null}
 */
export function serializeFlag (flag: NodeFlags): string | null {
	switch (flag) {
		case NodeFlags.Const:
			return "const";
		case NodeFlags.Let:
			return "let";
	}
	return null;
}

/**
 * Returns true if the given item is a stringified keyword or a stringified operator.
 * @param {ArbitraryValue} item
 * @returns {boolean}
 */
export function isTokenLike (item: ArbitraryValue): boolean {
	return isWhitespace(item) || isKeywordLike(item) || isOperatorLike(item);
}

/**
 * Returns true if the given token expects an identifier. For example, '++' will throw exceptions
 * if given a primitive value.
 * @param {ArbitraryValue} item
 * @returns {boolean}
 */
export function throwsIfPrimitive (item: ArbitraryValue): boolean {
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
 * Returns true if the given item is a string of pure whitespace.
 * @param {ArbitraryValue} item
 * @returns {boolean}
 */
export function isWhitespace (item: ArbitraryValue): boolean {
	if (typeof item !== "string") return false;
	return /^[\t\n\r\s]+$/.test(item);
}

/**
 * Returns true if the given item is a stringified keyword.
 * @param {ArbitraryValue} item
 * @returns {boolean}
 */
export function isKeywordLike (item: ArbitraryValue): boolean {
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
export function isOperatorLike (item: ArbitraryValue): boolean {
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

/**
 * Serializes the given token (operand) and returns the textual representation of it.
 * @param {SyntaxKind} token
 * @returns {string|BindingIdentifier}
 */
export function serializeToken (token: SyntaxKind | TypeNode): string | IBindingIdentifier {
	switch (token) {
		case SyntaxKind.BreakStatement:
			return "break";
		case SyntaxKind.ThrowStatement:
			return "throw";
		case SyntaxKind.DoStatement:
			return "do";
		case SyntaxKind.ContinueStatement:
			return "continue";
		case SyntaxKind.ObjectKeyword:
			return "object";
		case SyntaxKind.NumberKeyword:
			return "number";
		case SyntaxKind.NeverKeyword:
			return "never";
		case SyntaxKind.BooleanKeyword:
			return "boolean";
		case SyntaxKind.AnyKeyword:
			return "any";
		case SyntaxKind.VoidKeyword:
			return "void";
		case SyntaxKind.SymbolKeyword:
			return "symbol";
		case SyntaxKind.NullKeyword:
			return "null";
		case SyntaxKind.UndefinedKeyword:
			return "undefined";
		case SyntaxKind.StringKeyword:
			return "string";
		case SyntaxKind.TrueKeyword:
			return "true";
		case SyntaxKind.FalseKeyword:
			return "false";
		case SyntaxKind.BreakKeyword:
			return "break";
		case SyntaxKind.CatchKeyword:
			return "catch";
		case SyntaxKind.CaseKeyword:
			return "case";
		case SyntaxKind.ClassKeyword:
			return "class";
		case SyntaxKind.ConstKeyword:
			return "const";
		case SyntaxKind.ContinueKeyword:
			return "continue";
		case SyntaxKind.DebuggerKeyword:
			return "debugger";
		case SyntaxKind.DefaultKeyword:
			return "default";
		case SyntaxKind.DeleteKeyword:
			return "delete";
		case SyntaxKind.DeleteExpression:
			return "delete";
		case SyntaxKind.DoKeyword:
			return "do";
		case SyntaxKind.ElseKeyword:
			return "else";
		case SyntaxKind.EnumKeyword:
			return "enum";
		case SyntaxKind.ExportKeyword:
			return "export";
		case SyntaxKind.ExtendsKeyword:
			return "extends";
		case SyntaxKind.FinallyKeyword:
			return "finally";
		case SyntaxKind.ForKeyword:
			return "for";
		case SyntaxKind.FunctionKeyword:
			return "function";
		case SyntaxKind.IfKeyword:
			return "if";
		case SyntaxKind.ImportKeyword:
			return "import";
		case SyntaxKind.InKeyword:
			return "in";
		case SyntaxKind.InstanceOfKeyword:
			return "instanceof";
		case SyntaxKind.NewKeyword:
			return "new";
		case SyntaxKind.ReturnKeyword:
		case SyntaxKind.ReturnStatement:
			return "return";
		case SyntaxKind.SuperKeyword:
			return "super";
		case SyntaxKind.ThisKeyword:
			return new BindingIdentifier("this");
		case SyntaxKind.ThrowKeyword:
			return "throw";
		case SyntaxKind.TryKeyword:
			return "try";
		case SyntaxKind.TypeOfKeyword:
			return "typeof";
		case SyntaxKind.VarKeyword:
			return "var";
		case SyntaxKind.WithKeyword:
			return "with";
		case SyntaxKind.ImplementsKeyword:
			return "implements";
		case SyntaxKind.InterfaceKeyword:
			return "interface";
		case SyntaxKind.LetKeyword:
			return "let";
		case SyntaxKind.PackageKeyword:
			return "package";
		case SyntaxKind.PrivateKeyword:
			return "private";
		case SyntaxKind.ProtectedKeyword:
			return "protected";
		case SyntaxKind.PublicKeyword:
			return "public";
		case SyntaxKind.StaticKeyword:
			return "static";
		case SyntaxKind.YieldKeyword:
			return "yield";
		case SyntaxKind.AbstractKeyword:
			return "abstract";
		case SyntaxKind.AsKeyword:
			return "as";
		case SyntaxKind.AsyncKeyword:
			return "async";
		case SyntaxKind.AwaitKeyword:
			return "await";
		case SyntaxKind.ConstructorKeyword:
			return "constructor";
		case SyntaxKind.DeclareKeyword:
			return "declare";
		case SyntaxKind.GetKeyword:
			return "get";
		case SyntaxKind.IsKeyword:
			return "is";
		case SyntaxKind.KeyOfKeyword:
			return "keyof";
		case SyntaxKind.ModuleKeyword:
			return "module";
		case SyntaxKind.NamespaceKeyword:
			return "namespace";
		case SyntaxKind.ReadonlyKeyword:
			return "readonly";
		case SyntaxKind.RequireKeyword:
			return "require";
		case SyntaxKind.SetKeyword:
			return "set";
		case SyntaxKind.TypeKeyword:
			return "type";
		case SyntaxKind.FromKeyword:
			return "from";
		case SyntaxKind.GlobalKeyword:
			return "global";
		case SyntaxKind.OfKeyword:
			return "of";
		case SyntaxKind.MinusToken:
			return "-";
		case SyntaxKind.PlusToken:
			return "+";
		case SyntaxKind.PlusPlusToken:
			return "++";
		case SyntaxKind.MinusMinusToken:
			return "--";
		case SyntaxKind.PlusEqualsToken:
			return "+=";
		case SyntaxKind.MinusEqualsToken:
			return "-=";
		case SyntaxKind.AsteriskToken:
			return "*";
		case SyntaxKind.AtToken:
			return "@";
		case SyntaxKind.EqualsEqualsEqualsToken:
			return "===";
		case SyntaxKind.EqualsEqualsToken:
			return "==";
		case SyntaxKind.EqualsGreaterThanToken:
			return "=>";
		case SyntaxKind.EqualsToken:
			return "=";
		case SyntaxKind.AsteriskEqualsToken:
			return "*=";
		case SyntaxKind.AsteriskAsteriskEqualsToken:
			return "**=";
		case SyntaxKind.ExclamationEqualsEqualsToken:
			return "!==";
		case SyntaxKind.ExclamationEqualsToken:
			return "!=";
		case SyntaxKind.ExclamationToken:
			return "!";
		case SyntaxKind.BarBarToken:
			return "||";
		case SyntaxKind.BarToken:
			return "|";
		case SyntaxKind.BarEqualsToken:
			return "|=";
		case SyntaxKind.AmpersandAmpersandToken:
			return "&&";
		case SyntaxKind.AmpersandEqualsToken:
			return "&=";
		case SyntaxKind.AmpersandToken:
			return "&";
		case SyntaxKind.SlashEqualsToken:
			return "/=";
		case SyntaxKind.SlashToken:
			return "/";
		case SyntaxKind.LessThanSlashToken:
			return "</";
		case SyntaxKind.PercentToken:
			return "%";
		case SyntaxKind.PercentEqualsToken:
			return "%=";
		case SyntaxKind.ColonToken:
			return ":";
		case SyntaxKind.SemicolonToken:
			return ";";
		case SyntaxKind.LessThanEqualsToken:
			return "<=";
		case SyntaxKind.LessThanToken:
			return "<";
		case SyntaxKind.LessThanLessThanEqualsToken:
			return "<<=";
		case SyntaxKind.LessThanLessThanToken:
			return "<<";
		case SyntaxKind.GreaterThanEqualsToken:
			return ">=";
		case SyntaxKind.GreaterThanGreaterThanEqualsToken:
			return ">>=";
		case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
			return ">>>";
		case SyntaxKind.GreaterThanGreaterThanToken:
			return ">>";
		case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
			return ">>>=";
		case SyntaxKind.GreaterThanToken:
			return ">";
		case SyntaxKind.QuestionToken:
			return "?";
		case SyntaxKind.TildeToken:
			return "~";
		case SyntaxKind.CaretToken:
			return "^";
		case SyntaxKind.CaretEqualsToken:
			return "^=";
		case SyntaxKind.AsteriskAsteriskToken:
			return "**";
		case SyntaxKind.CommaToken:
			return ",";
		case SyntaxKind.OpenBraceToken:
			return "{";
		case SyntaxKind.CloseBraceToken:
			return "}";
		case SyntaxKind.OpenParenToken:
			return "(";
		case SyntaxKind.CloseParenToken:
			return ")";
		case SyntaxKind.OpenBracketToken:
			return "[";
		case SyntaxKind.CloseBracketToken:
			return "]";
		case SyntaxKind.DotToken:
			return ".";
		case SyntaxKind.DotDotDotToken:
			return "...";
		default:
			throw new TypeError(`${serializeToken.name} could not serialize a token of kind ${SyntaxKind[<SyntaxKind>token]}`);
	}
}

function isQuote (content: string): boolean {
	return /["'`]/.test(content);
}

export function stripQuotesIfNecessary (content: ArbitraryValue): ArbitraryValue {
	if (!(typeof content === "string")) return content;
	const trimmed = content;
	const firstChar = trimmed[0];
	const lastChar = trimmed[trimmed.length - 1];
	const startsWithQuote = isQuote(firstChar);
	const endsWithQuote = isQuote(lastChar);
	const startOffset = startsWithQuote ? 1 : 0;
	const endOffset = endsWithQuote ? 1 : 0;
	return trimmed.slice(startOffset, trimmed.length - endOffset);
}

export function quoteIfNecessary (content: ArbitraryValue): ArbitraryValue {
	if (!(typeof content === "string")) return content;
	const REPLACEMENT_CHAR = "`";
	const trimmed = content;
	const firstChar = trimmed[0];
	const lastChar = trimmed[trimmed.length - 1];
	let str = REPLACEMENT_CHAR;
	const startsWithClashingQuote = firstChar === REPLACEMENT_CHAR;
	const endsWithClashingQuote = lastChar === REPLACEMENT_CHAR;

	if (startsWithClashingQuote && endsWithClashingQuote) {
		const insideQuotes = trimmed.match(new RegExp(`^${REPLACEMENT_CHAR}([^${REPLACEMENT_CHAR}]*)${REPLACEMENT_CHAR}`));
		// If there are nothing but whitespace inside the quotes, just return them.
		if (insideQuotes != null && isWhitespace(insideQuotes[1])) return content;
	}

	const startOffset = startsWithClashingQuote ? 1 : 0;
	const endOffset = endsWithClashingQuote ? 1 : 0;
	if (startsWithClashingQuote) str += `\\${REPLACEMENT_CHAR}`;
	str += trimmed.slice(startOffset, trimmed.length - endOffset);
	if (endsWithClashingQuote) str += `\\${REPLACEMENT_CHAR}`;
	str += REPLACEMENT_CHAR;
	return str;
}

/**
 * Takes all ITypeBindings from a TypeExpression and returns an array of them.
 * @param {TypeExpression} expression
 * @param {boolean} [deep=false]
 * @returns {ITypeBinding[]}
 */
export function takeTypeBindings (expression: TypeExpression, deep: boolean = false): ITypeBinding[] {
	const bindings: ITypeBinding[] = [];

	expression.forEach(token => {
		if (isTypeBinding(token)) {
			bindings.push(token);

			if (token.typeArguments != null && deep) {
				takeTypeBindings(token.typeArguments, deep).forEach(typeBinding => bindings.push(typeBinding));
			}
		}
	});
	return bindings;
}