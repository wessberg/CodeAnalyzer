import {ArrayBindingPattern, Identifier, ObjectBindingPattern, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {ICache} from "../cache/interface/ICache";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {isArrayBindingPattern, isIdentifierObject, isObjectBindingPattern, isOmittedExpression, isVariableDeclaration, isVariableStatement} from "../predicate/PredicateFunctions";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {IBaseVariableAssignment, IdentifierMapKind, INonNullableValueable, IVariableAssignment, VariableIndexer} from "../service/interface/ISimpleLanguageService";
import {ITracer} from "../tracer/interface/ITracer";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IVariableFormatter} from "./interface/IVariableFormatter";

export class VariableFormatter implements IVariableFormatter {

	constructor (private valueExpressionGetter: IValueExpressionGetter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private nameGetter: INameGetter,
							 private mapper: IMapper,
							 private cache: ICache,
							 private tracer: ITracer,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private modifiersFormatter: IModifiersFormatter,
							 private typeExpressionGetter: ITypeExpressionGetter,
							 private tokenSerializer: ITokenSerializer,
							 private typeUtil: ITypeUtil) {}

	/**
	 * Formats the given VariableStatement and returns a VariableIndexer.
	 * @param {VariableStatement|VariableDeclarationList|VariableDeclaration} statement
	 * @returns {VariableIndexer}
	 */
	public format (statement: VariableStatement | VariableDeclarationList | VariableDeclaration): VariableIndexer {
		const assignmentMap: VariableIndexer = {};

		if (isVariableDeclaration(statement)) {
			const assignments = this.formatVariableDeclaration(statement);
			assignments.forEach(assignment => assignmentMap[assignment.name] = assignment);
		} else {
			const declarations = isVariableStatement(statement) ? statement.declarationList.declarations : statement.declarations;
			declarations.forEach(declaration => {
				const assignments = this.formatVariableDeclaration(declaration);
				assignments.forEach(assignment => assignmentMap[assignment.name] = assignment);
			});
		}
		return assignmentMap;
	}

	private formatBaseVariableAssignment (declaration: VariableDeclaration): IBaseVariableAssignment {
		const valueExpression = declaration.initializer == null ? null : this.valueExpressionGetter.getValueExpression(declaration.initializer);
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const typeExpression = declaration.type == null ? null : this.typeExpressionGetter.getTypeExpression(declaration.type);
		const typeFlattened = typeExpression == null ? null : this.tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : this.typeUtil.takeTypeBindings(typeExpression);
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: IBaseVariableAssignment = {
			___kind: IdentifierMapKind.VARIABLE,
			filePath,
			value: {
				expression: valueExpression
			},
			modifiers: this.modifiersFormatter.format(declaration),
			startsAt,
			endsAt,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			}
		};

		return map;
	}

	private formatStandardVariableDeclaration (declaration: VariableDeclaration & { name: Identifier }): IVariableAssignment {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const name = declaration.name.text;

		const cached = this.cache.getCachedVariable(filePath, name);
		if (cached != null && !this.cache.cachedVariableNeedsUpdate(cached.content)) return cached.content;
		const base = this.formatBaseVariableAssignment(declaration);
		const that = this;
		const scope = this.tracer.traceThis(declaration);

		const map: IVariableAssignment = {
			...base,
			name,
			value: {
				expression: base.value.expression,
				resolved: undefined,
				hasDoneFirstResolve () {return map.value.resolved !== undefined;},
				resolving: false,
				resolve () {
					map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope);
					return map.value.resolved;
				}
			}
		};

		// Make the ___kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.VARIABLE,
			enumerable: false
		});

		this.mapper.set(map, declaration);
		this.cache.setCachedVariable(filePath, map);
		return map;
	}

	private formatVariableDeclaration (declaration: VariableDeclaration): IVariableAssignment[] {

		if (!isIdentifierObject(declaration.name)) {} else {
			return [this.formatStandardVariableDeclaration(<VariableDeclaration & { name: Identifier }>declaration)];
		}

		if (isArrayBindingPattern(declaration.name)) {
			return this.formatArrayBindingPatternVariableDeclaration(<VariableDeclaration & { name: ArrayBindingPattern }>declaration);
		}

		if (isObjectBindingPattern(declaration.name)) {
			return this.formatObjectBindingPatternVariableDeclaration(<VariableDeclaration & { name: ObjectBindingPattern }>declaration);
		}

		throw new TypeError(`${this.formatVariableDeclaration.name} could not format variable declaration because a name couldn't be determined!`);
	}

	private formatArrayBindingPatternVariableDeclaration (declaration: VariableDeclaration & { name: ArrayBindingPattern }): IVariableAssignment[] {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const assignments: IVariableAssignment[] = [];

		declaration.name.elements.forEach((binding, index) => {
			if (isOmittedExpression(binding)) return;

			const name = <string>this.nameGetter.getName(binding);
			const cached = name == null ? null : this.cache.getCachedVariable(filePath, name);
			if (cached != null && !this.cache.cachedVariableNeedsUpdate(cached.content)) assignments.push(cached.content);
			else {
				const base = this.formatBaseVariableAssignment(declaration);
				const that = this;
				const scope = this.tracer.traceThis(declaration);

				const map: IVariableAssignment = {
					...base,
					name,
					value: {
						expression: base.value.expression,
						resolved: undefined,
						hasDoneFirstResolve () {return map.value.resolved !== undefined;},
						resolving: false,
						resolve () {
							map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope, index);
							return map.value.resolved;
						}
					}
				};

				// Make the ___kind non-enumerable.
				Object.defineProperty(map, "___kind", {
					value: IdentifierMapKind.VARIABLE,
					enumerable: false
				});

				this.cache.setCachedVariable(filePath, map);
				assignments.push(map);
			}
		});
		return assignments;
	}

	private formatObjectBindingPatternVariableDeclaration (declaration: VariableDeclaration & { name: ObjectBindingPattern }): IVariableAssignment[] {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const assignments: IVariableAssignment[] = [];

		declaration.name.elements.forEach(binding => {
			const name = <string>this.nameGetter.getName(binding);
			const cached = name == null ? null : this.cache.getCachedVariable(filePath, name);
			if (cached != null && !this.cache.cachedVariableNeedsUpdate(cached.content)) assignments.push(cached.content);
			else {
				const base = this.formatBaseVariableAssignment(declaration);
				const that = this;
				const scope = this.tracer.traceThis(declaration);

				const map: IVariableAssignment = {
					...base,
					name,
					value: {
						expression: base.value.expression,
						resolved: undefined,
						hasDoneFirstResolve () {return map.value.resolved !== undefined;},
						resolving: false,
						resolve () {
							map.value.resolved = map.value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, declaration, scope, name);
							return map.value.resolved;
						}
					}
				};

				// Make the ___kind non-enumerable.
				Object.defineProperty(map, "___kind", {
					value: IdentifierMapKind.VARIABLE,
					enumerable: false
				});

				this.mapper.set(map, declaration);
				this.cache.setCachedVariable(filePath, map);
				assignments.push(map);
			}
		});
		return assignments;
	}
}