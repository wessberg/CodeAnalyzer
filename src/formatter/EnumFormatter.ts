import {EnumDeclaration} from "typescript";
import {IEnumFormatter} from "./interface/IEnumFormatter";
import {cache, decoratorsFormatter, identifierUtil, mapper, nameGetter, sourceFilePropertiesGetter} from "../services";
import {IdentifierMapKind, IEnumDeclaration} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IEnumDeclaration
 */
export class EnumFormatter implements IEnumFormatter {

	/**
	 * Formats the given EnumDeclaration and returns an IEnumDeclaration.
	 * @param {EnumDeclaration} statement
	 * @returns {IEnumDeclaration}
	 */
	public format (statement: EnumDeclaration): IEnumDeclaration {
		const startsAt = statement.pos;
		const endsAt = statement.end;
		const name = <string>nameGetter.getNameOfMember(statement.name, false, true);
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath;

		const cached = cache.getCachedEnum(filePath, name);
		if (cached != null && !cache.cachedEnumNeedsUpdate(cached.content)) return cached.content;

		const taken: Set<number> = new Set();
		const members: { [key: string]: number|string } = {};
		statement.members.forEach(member => {
			const memberName = <string>nameGetter.getNameOfMember(member.name, false, true);
			const initializer = member.initializer;
			const initializerValue = initializer == null ? this.findFreeEnumIntegerValue(taken) : <number>nameGetter.getNameOfMember(initializer, true, false);

			taken.add(initializerValue);
			if (memberName != null) members[memberName] = initializerValue;
		});

		const map: IEnumDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.ENUM,
			startsAt,
			endsAt,
			name,
			members,
			filePath,
			decorators: decoratorsFormatter.format(statement)
		}, IdentifierMapKind.ENUM);

		mapper.set(map, statement);
		cache.setCachedEnum(filePath, map);
		return map;
	}

	/**
	 * Finds a free enum ordinal value. Free meaning that no other member of the enumeration is initialized to that value.
	 * @param {Set<number>} taken
	 * @returns {number}
	 */
	private findFreeEnumIntegerValue (taken: Set<number>): number {
		const sorted = [...taken].sort();

		for (let i = 0; i < sorted.length; i++) {
			if (taken.has(i)) continue;
			return i;
		}
		return sorted.length;
	}

}