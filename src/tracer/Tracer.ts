import {ClassDeclaration, Expression, Node, Statement, SyntaxKind} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {isArrowFunction, isClassDeclaration, isClassExpression, isConstructorDeclaration, isExtendsClause, isFunctionDeclaration, isFunctionExpression, isMethodDeclaration, isPropertyDeclaration, isSourceFile, isTypeBinding} from "../predicate/PredicateFunctions";
import {ICallExpression, ICodeAnalyzer, IdentifierMapKind, IIdentifier, IIdentifierMap, IImportExportBinding, IParameter} from "../service/interface/ICodeAnalyzer";
import {Config} from "../static/Config";
import {ITracer} from "./interface/ITracer";
import {IMapper} from "../mapper/interface/IMapper";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {ICache} from "../cache/interface/ICache";

export class Tracer implements ITracer {

	constructor (private languageService: ICodeAnalyzer,
							 private cache: ICache,
							 private typeExpressionGetter: ITypeExpressionGetter,
							 private mapper: IMapper,
							 private nameGetter: INameGetter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter) {
	}

	/**
	 * Finds matching declarations for the given identifier and returns the one that is nearest to the given statement.
	 * @param {Statement|Expression|Node} from
	 * @param {string} block
	 * @param {string} identifier
	 * @param {IIdentifierMap} clojure
	 * @param {IdentifierMapKind} [ofKind]
	 * @returns {IIdentifier|null}
	 */
	public findNearestMatchingIdentifier (from: Statement|Expression|Node, block: string, identifier: string, clojure: IIdentifierMap, ofKind?: IdentifierMapKind): IIdentifier {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(from).filePath;

		if (identifier === "super" && (ofKind == null || (ofKind === IdentifierMapKind.CLASS))) {
			const scope = this.traceThis(from);
			const classStatement = <ClassDeclaration>this.traceUpToKind(SyntaxKind.ClassDeclaration, from) || this.traceUpToKind(SyntaxKind.ClassExpression, from);
			if (classStatement == null || classStatement.heritageClauses == null) throw new TypeError(`${this.constructor.name} could not find a parent class of a super() expression.`);
			let parentName: string|null = null;

			classStatement.heritageClauses.forEach(clause => {
				if (isExtendsClause(clause)) {
					// There can only be one extended class.
					const [classIdentifier] = clause.types;
					const [extendsClass] = this.typeExpressionGetter.getTypeExpression(classIdentifier);
					if (isTypeBinding(extendsClass)) parentName = extendsClass.name;
				}
			});
			if (parentName == null) {
				throw new ReferenceError(`${this.constructor.name} could not trace the super class for ${clojure.classes[scope].name}`);
			}
			return clojure.classes[<string>parentName];
		}

		const allMatches: IIdentifier[] = [];
		const functionMatch = clojure.functions[identifier];
		const enumMatch = clojure.enums[identifier];
		const variableMatch = clojure.variables[identifier];
		const classMatch = clojure.classes[identifier];

		let parameterMatches: IParameter[] = [];

		if (from.kind === SyntaxKind.FunctionExpression || from.kind === SyntaxKind.FunctionDeclaration || this.isChildOfAnyOfKinds([SyntaxKind.FunctionExpression, SyntaxKind.FunctionDeclaration], block, from)) {
			Object.keys(clojure.functions).forEach(key => {
				const parameters = clojure.functions[key].parameters.parametersList;
				const parameter = parameters.find(parameter => parameter.name.some(part => part === identifier));
				if (parameter != null) parameterMatches.push(parameter);
			});
		}

		if (from.kind === SyntaxKind.MethodDeclaration || this.isChildOfKind(SyntaxKind.MethodDeclaration, block, from)) {
			Object.keys(clojure.classes).forEach(key => {
				const methods = clojure.classes[key].methods;
				Object.keys(methods).forEach(methodName => {
					const parameters = methods[methodName].parameters.parametersList;
					const parameter = parameters.find(parameter => parameter.name.some(part => part === identifier));
					if (parameter != null) parameterMatches.push(parameter);
				});
			});
		}

		if (from.kind === SyntaxKind.Constructor || this.isChildOfAnyOfKinds([SyntaxKind.Constructor], block, from)) {
			Object.keys(clojure.classes).forEach(key => {
				const ctor = clojure.classes[key].constructor;
				if (ctor == null) return;

				const parameters = ctor.parameters.parametersList;
				const parameter = parameters.find(parameter => parameter.name.some(part => part === identifier));
				if (parameter != null) parameterMatches.push(parameter);
			});
		}

		if (this.isChildOfKind(SyntaxKind.ArrowFunction, block, from)) {
			clojure.arrowFunctions.forEach(arrowFunction => {
				const parameters = arrowFunction.parameters.parametersList;
				const parameter = parameters.find(parameter => parameter.name.some(part => part === identifier));
				if (parameter != null) {
					parameterMatches.push(parameter);
				}
			});
		}

		const requireMatches: ICallExpression[] = [];
		if (identifier === "require") {
			clojure.callExpressions.forEach(callExpression => {
				if (callExpression.identifier === "require") requireMatches.push(callExpression);
			});
		}

		const importBindingMatches: IImportExportBinding[] = [];
		clojure.imports.forEach(importDeclaration => {
			const match = importDeclaration.bindings[identifier];
			if (match != null) importBindingMatches.push(match);
		});

		const exportBindingMatches: IImportExportBinding[] = [];
		clojure.exports.forEach(exportDeclaration => {
			const mapped1 = this.mapper.get(exportDeclaration);
			const mapped2 = this.mapper.get(exportDeclaration.bindings[identifier]);
			if (mapped1 != null && mapped1 === from) return;
			if (mapped2 != null && mapped2 === from) return;

			const match = exportDeclaration.bindings[identifier];
			if (match != null && exportDeclaration.filePath !== filePath) exportBindingMatches.push(match);
		});

		if (functionMatch != null) allMatches.push(functionMatch);
		if (enumMatch != null) allMatches.push(enumMatch);
		if (variableMatch != null) allMatches.push(variableMatch);
		if (classMatch != null) allMatches.push(classMatch);

		importBindingMatches.forEach(match => {
			const mapped = this.mapper.get(match);
			if (mapped != null && mapped === from) {
				return;
			}
			allMatches.push(match.payload());
		});

		exportBindingMatches.forEach(match => {
			const mapped = this.mapper.get(match);
			if (mapped != null && mapped === from) return;
			allMatches.push(match.payload());
		});

		requireMatches.forEach(match => {
			const mapped = this.mapper.get(match);
			if (mapped != null && mapped === from) {
				return;
			}
			;
			allMatches.push(match);
		});

		parameterMatches.forEach(parameterMatch => {
			const mapped = this.mapper.get(parameterMatch);
			if (mapped != null && mapped === from) return;
			allMatches.push(parameterMatch);
		});

		const filtered = allMatches.filter(match => ofKind == null ? true : match.___kind === ofKind);

		return filtered.sort((a, b) => {
			const aDistanceFromStart = from.pos - a.startsAt;
			const bDistanceFromStart = from.pos - b.startsAt;
			if (aDistanceFromStart > bDistanceFromStart) return -1;
			if (aDistanceFromStart < bDistanceFromStart) return 1;
			return 0;
		})[0];
	}

	/**
	 * Attempts to find the variable, class, function, import, enum, export, etc that is related to the given identifier.
	 * It starts from the given file.
	 * @param {string} identifier
	 * @param {Statement|Expression|Node} from
	 * @param {string} [scope]
	 * @param {IdentifierMapKind} [ofKind]
	 * @returns {IIdentifier}
	 */
	public traceIdentifier (identifier: string, from: Statement|Expression|Node, scope?: string, ofKind?: IdentifierMapKind): IIdentifier {
		if (scope === undefined) scope = identifier === "this" || identifier === "super" ? this.traceThis(from) : this.traceBlockScopeName(from);
		if ((identifier === "this" || identifier === "super") && scope == null) throw new ReferenceError(`${this.traceIdentifier.name} could not trace the context of 'this' when no scope was given!`);

		const filePath = from.getSourceFile().fileName;
		const cached = this.cache.getCachedTracedIdentifier(filePath, identifier, scope);
		if (cached != null && !this.cache.cachedTracedIdentifierNeedsUpdate(filePath, identifier, scope)) return cached.content;

		let lookupIdentifier: string = identifier;
		if (identifier === "super") {

			const clojure = this.traceClojure(from);
			if (clojure == null) throw new ReferenceError(`${this.constructor.name} could not trace the super class from scope '${scope}'`);
			const thisScope = this.traceThis(from);
			const derivedClass = clojure.classes[thisScope];
			if (derivedClass == null) throw new ReferenceError(`${this.constructor.name} could not find a class for the scope '${thisScope}'`);
			if (derivedClass.heritage == null || derivedClass.heritage.extendsClass == null) throw new ReferenceError(`${this.constructor.name} could not find a super class for the scope '${thisScope}'`);
			lookupIdentifier = derivedClass.heritage.extendsClass.name;

		} else if (identifier === "this" && scope != null && scope !== Config.name.global) {
			lookupIdentifier = scope;
		}

		const clojure = this.traceClojure(from);
		const block = this.traceBlockScopeName(from);

		if (clojure == null) {
			return {
				___kind: IdentifierMapKind.LITERAL,
				startsAt: from.pos,
				endsAt: from.end,
				value: () => [clojure]
			};
		}
		const nearest = this.findNearestMatchingIdentifier(from, block, lookupIdentifier, clojure, ofKind);
		this.cache.setCachedTracedIdentifier(filePath, identifier, scope, nearest);
		return nearest;
	}

	/**
	 * Attempts to find the identifying name for 'this' in the given context from the given statement.
	 * @param {Statement|Expression|Node} statement
	 * @returns {string}
	 */
	public traceThis (statement: Statement|Expression|Node): string {
		return this.traceBlock(statement, block => {

			if (isSourceFile(block)) {
				return Config.name.global;
			}

			if (
				isFunctionExpression(block) ||
				isFunctionDeclaration(block)
			) {
				const name = block.name == null ? block.parent == null ? Config.name.global : this.traceThis(block.parent) : this.nameGetter.getName(block);
				return name == null ? Config.name.global : name;
			}

			if (
				isClassDeclaration(block) ||
				isClassExpression(block)
			) {
				const name = this.nameGetter.getName(block);
				return name == null ? Config.name.global : name;
			}

			if (
				isMethodDeclaration(block) ||
				isPropertyDeclaration(block) ||
				isConstructorDeclaration(block)
			) {
				if (block.parent == null) {
					const name = this.nameGetter.getName(block);
					return name == null ? Config.name.global : name;
				}
				return this.traceThis(block.parent);
			}

			if (isArrowFunction(block)) {
				return block.parent == null ? Config.name.global : this.traceThis(block.parent);
			}

			throw new TypeError(`${this.traceThis.name} could not trace a 'this' value for a statement of kind ${SyntaxKind[statement.kind]}`);
		});
	}

	/**
	 * Traces the clojure (snapshots the available state) from the given statement (e.g. which identifiers it has access to)
	 * and returns an IIdentifierMap.
	 * @param {Statement|Expression|Node|string} from
	 * @returns {IIdentifierMap|null}
	 */
	public traceClojure (from: Statement|Expression|Node|string): IIdentifierMap|null {
		const filePath = typeof from === "string" ? from : this.sourceFilePropertiesGetter.getSourceFileProperties(from).filePath;
		if (Config.builtIns.has(filePath)) {
			return null;
		}

		// TODO: We shouldn't go deep and get ALL identifiers (which will ignore concepts such as conditional branches or even if the statement has access to the statement).
		return this.languageService.getAllIdentifiersForFile(filePath, true);
	}

	/**
	 * Attempts to find the proper name for the block scope that the current statement lives within.
	 * @param {Statement|Expression|Node} statement
	 * @returns {string}
	 */
	public traceBlockScopeName (statement: Statement|Expression|Node): string {
		return this.traceBlock(statement, block => {

			if (isSourceFile(block)) {
				return Config.name.global;
			}

			if (
				isFunctionExpression(block) ||
				isFunctionDeclaration(block) ||
				isMethodDeclaration(block) ||
				isClassDeclaration(block) ||
				isClassExpression(block)
			) {
				const name = this.nameGetter.getName(block);
				return name == null ? Config.name.global : name;
			}

			if (
				isConstructorDeclaration(block)
			) {
				return "constructor";
			}

			if (
				isPropertyDeclaration(block)
			) {
				if (block.parent == null) {
					const name = this.nameGetter.getName(block);
					return name == null ? Config.name.global : name;
				}
				return this.traceBlockScopeName(block.parent);
			}

			if (isArrowFunction(block)) {
				return Config.name.anonymous;
			}

			throw new TypeError(`${this.traceBlockScopeName.name} could not trace a block scope of a statement of knd ${SyntaxKind[statement.kind]}`);
		});
	}

	/**
	 * Finds the nearest relevant block and calls the given extractor function with it.
	 * @param {Statement|Expression|Node} statement
	 * @param {(statement: Statement|Expression|Node) => string} extractor
	 * @returns {string}
	 */
	private traceBlock (statement: Statement|Expression|Node, extractor: (statement: Statement|Expression|Node) => string): string {
		let current: Statement|Expression|Node = statement;

		while (
			!isClassDeclaration(current) &&
			!isClassExpression(current) &&
			!isFunctionExpression(current) &&
			!isFunctionDeclaration(current) &&
			!isMethodDeclaration(current) &&
			!isConstructorDeclaration(current) &&
			!isArrowFunction(current) &&
			!isPropertyDeclaration(current) &&
			!isSourceFile(current)) {
			if (current.parent == null) break;
			current = current.parent;
		}

		return extractor(current);
	}

	private traceUpToKind (kind: SyntaxKind, from: Statement|Expression|Node): Statement|Expression|Node|null {
		let current: Statement|Expression|Node|undefined = from;
		while (current != null) {
			if (current.kind === kind) return current;
			current = current.parent;
		}
		return null;
	}

	/**
	 * Returns true if the given statement is child of a statement of any of the provided kinds.
	 * @param {SyntaxKind[]} kinds
	 * @param {string} identifier
	 * @param {Statement|Expression|Node} from
	 * @returns {boolean}
	 */
	private isChildOfAnyOfKinds (kinds: SyntaxKind[], identifier: string, from: Statement|Expression|Node): boolean {
		return kinds.some(kind => this.isChildOfKind(kind, identifier, from));
	}

	/**
	 * Returns true if the given statement is child of a statement of the provided kind.
	 * @param {SyntaxKind} kind
	 * @param {string} identifier
	 * @param {Statement|Expression|Node} from
	 * @returns {boolean}
	 */
	private isChildOfKind (kind: SyntaxKind, identifier: string, from: Statement|Expression|Node): boolean {
		let current: Statement|Expression|Node|undefined = from;
		while (current != null) {
			if (current.kind === kind && this.nameGetter.getName(current) === identifier) return true;
			current = current.parent;
		}
		return false;
	}
}