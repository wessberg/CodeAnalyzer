import {BinaryOperator, Expression, Node, NodeFlags, Statement, SyntaxKind, TypeNode} from "typescript";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {IBindingIdentifier} from "../model/interface/IBindingIdentifier";
import {isTypeBinding} from "../predicate/PredicateFunctions";
import {ITokenSerializer} from "./interface/ITokenSerializer";
import {ArbitraryValue, TypeExpression} from "../identifier/interface/IIdentifier";

/**
 * A class that can serialize tokens and type expressions.
 */
export class TokenSerializer implements ITokenSerializer {

	/**
	 * Formats and returns a string representation of a type.
	 * @param {TypeExpression} expression
	 * @returns {string}
	 */
	public serializeTypeExpression (expression: TypeExpression): string {
		let statement: string = "";
		expression.forEach(token => {
			if (isTypeBinding(token)) {
				statement += token.name;
				if (token.typeArguments != null) {
					statement += `<${this.serializeTypeExpression(token.typeArguments)}>`;
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
	 * @param {Statement|Expression|Node} parent
	 * @returns {ArbitraryValue}
	 */
	public marshalToken (token: SyntaxKind|BinaryOperator|TypeNode, parent: Statement|Expression|Node): ArbitraryValue {
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
				return this.serializeToken(token, parent);
		}
	}

	/**
	 * Serializes the given flag and returns the textual representation of it.
	 * @param {NodeFlags} flag
	 * @returns {string|null}
	 */
	public serializeFlag (flag: NodeFlags): string|null {
		switch (flag) {
			case NodeFlags.Const:
				return "const";
			case NodeFlags.Let:
				return "let";
		}
		return null;
	}

	/**
	 * Serializes the given token (operand) and returns the textual representation of it.
	 * @param {SyntaxKind} token
	 * @param {Statement|Expression|Node} parent
	 * @returns {string|BindingIdentifier}
	 */
	public serializeToken (token: SyntaxKind|TypeNode, parent: Statement|Expression|Node): string|IBindingIdentifier {
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
				return new BindingIdentifier("super", parent);
			case SyntaxKind.ThisKeyword:
				return new BindingIdentifier("this", parent);
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
				throw new TypeError(`${this.serializeToken.name} could not serialize a token of kind ${SyntaxKind[<SyntaxKind>token]}`);
		}
	}
}