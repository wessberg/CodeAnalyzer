import {ArrayBindingPattern, Identifier, ObjectBindingPattern, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {isArrayBindingPattern, isIdentifierObject, isObjectBindingPattern, isOmittedExpression, isVariableDeclaration, isVariableStatement} from "../predicate/PredicateFunctions";
import {IVariableFormatter} from "./interface/IVariableFormatter";
import {cache, identifierUtil, mapper, modifiersFormatter, nameGetter, sourceFilePropertiesGetter, tokenSerializer, typeExpressionGetter, typeUtil, valueableFormatter} from "../services";
import {IBaseVariableDeclaration, IdentifierMapKind, IVariableDeclaration, VariableIndexer} from "../identifier/interface/IIdentifier";

export class VariableFormatter implements IVariableFormatter {

	/**
	 * Formats the given VariableStatement and returns a VariableIndexer.
	 * @param {VariableStatement|VariableDeclarationList|VariableDeclaration} statement
	 * @returns {VariableIndexer}
	 */
	public format (statement: VariableStatement|VariableDeclarationList|VariableDeclaration): VariableIndexer {
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

	private formatBaseVariableAssignment (declaration: VariableDeclaration): IBaseVariableDeclaration {
		const startsAt = declaration.pos;
		const endsAt = declaration.end;
		const typeExpression = declaration.type == null ? null : typeExpressionGetter.getTypeExpression(declaration.type);
		const typeFlattened = typeExpression == null ? null : tokenSerializer.serializeTypeExpression(typeExpression);
		const typeBindings = typeExpression == null ? null : typeUtil.takeTypeBindings(typeExpression);
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		return {
			___kind: IdentifierMapKind.VARIABLE,
			filePath,
			modifiers: modifiersFormatter.format(declaration),
			startsAt,
			endsAt,
			type: {
				expression: typeExpression,
				flattened: typeFlattened,
				bindings: typeBindings
			}
		};
	}

	private formatStandardVariableDeclaration (declaration: VariableDeclaration&{ name: Identifier }): IVariableDeclaration {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const name = declaration.name.text;

		const cached = cache.getCachedVariable(filePath, name);
		if (cached != null && !cache.cachedVariableNeedsUpdate(cached.content)) return cached.content;
		const base = this.formatBaseVariableAssignment(declaration);
		const value = valueableFormatter.format(declaration.initializer);

		const map: IVariableDeclaration = identifierUtil.setKind({
			...base,
			name,
			value
		}, IdentifierMapKind.VARIABLE);

		mapper.set(map, declaration);
		cache.setCachedVariable(filePath, map);
		return map;
	}

	private formatVariableDeclaration (declaration: VariableDeclaration): IVariableDeclaration[] {

		if (!isIdentifierObject(declaration.name)) {
		} else {
			return [this.formatStandardVariableDeclaration(<VariableDeclaration&{ name: Identifier }>declaration)];
		}

		if (isArrayBindingPattern(declaration.name)) {
			return this.formatArrayBindingPatternVariableDeclaration(<VariableDeclaration&{ name: ArrayBindingPattern }>declaration);
		}

		if (isObjectBindingPattern(declaration.name)) {
			return this.formatObjectBindingPatternVariableDeclaration(<VariableDeclaration&{ name: ObjectBindingPattern }>declaration);
		}

		throw new TypeError(`${this.formatVariableDeclaration.name} could not format variable declaration because a name couldn't be determined!`);
	}

	private formatArrayBindingPatternVariableDeclaration (declaration: VariableDeclaration&{ name: ArrayBindingPattern }): IVariableDeclaration[] {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const assignments: IVariableDeclaration[] = [];

		declaration.name.elements.forEach((binding, index) => {
			if (isOmittedExpression(binding)) return;

			const name = <string>nameGetter.getName(binding);
			const cached = name == null ? null : cache.getCachedVariable(filePath, name);
			if (cached != null && !cache.cachedVariableNeedsUpdate(cached.content)) assignments.push(cached.content);
			else {
				const base = this.formatBaseVariableAssignment(declaration);
				const value = valueableFormatter.format(declaration.initializer, index);

				const map: IVariableDeclaration = identifierUtil.setKind({
					...base,
					name,
					value
				}, IdentifierMapKind.VARIABLE);

				cache.setCachedVariable(filePath, map);
				assignments.push(map);
			}
		});
		return assignments;
	}

	private formatObjectBindingPatternVariableDeclaration (declaration: VariableDeclaration&{ name: ObjectBindingPattern }): IVariableDeclaration[] {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;
		const assignments: IVariableDeclaration[] = [];

		declaration.name.elements.forEach(binding => {
			const name = <string>nameGetter.getName(binding);
			const cached = name == null ? null : cache.getCachedVariable(filePath, name);
			if (cached != null && !cache.cachedVariableNeedsUpdate(cached.content)) assignments.push(cached.content);
			else {
				const base = this.formatBaseVariableAssignment(declaration);
				const value = valueableFormatter.format(declaration.initializer, name);

				const map: IVariableDeclaration = identifierUtil.setKind({
					...base,
					name,
					value
				}, IdentifierMapKind.VARIABLE);

				mapper.set(map, declaration);
				cache.setCachedVariable(filePath, map);
				assignments.push(map);
			}
		});
		return assignments;
	}
}