import {IEnumFormatter} from "./interface/IEnumFormatter";
import {IdentifierMapKind, IEnumDeclaration} from "../service/interface/ISimpleLanguageService";
import {EnumDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ICache} from "../cache/interface/ICache";
import {IMapper} from "../mapper/interface/IMapper";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";

export class EnumFormatter implements IEnumFormatter {

	constructor (private mapper: IMapper,
							 private cache: ICache,
							 private nameGetter: INameGetter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private decoratorsFormatter: IDecoratorsFormatter) {}
	/**
	 * Formats the given EnumDeclaration and returns an IEnumDeclaration.
	 * @param {EnumDeclaration} statement
	 * @returns {IEnumDeclaration}
	 */
	public format (statement: EnumDeclaration): IEnumDeclaration {
		const startsAt = statement.pos;
		const endsAt = statement.end;
		const name = <string>this.nameGetter.getNameOfMember(statement.name, false, true);
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath;

		const cached = this.cache.getCachedEnum(filePath, name);
		if (cached != null && !this.cache.cachedEnumNeedsUpdate(cached.content)) return cached.content;

		const taken: Set<number> = new Set();
		const members: { [key: string]: number | string } = {};
		statement.members.forEach(member => {
			const memberName = <string>this.nameGetter.getNameOfMember(member.name, false, true);
			const initializer = member.initializer;
			const initializerValue = initializer == null ? this.findFreeEnumIntegerValue(taken) : <number>this.nameGetter.getNameOfMember(initializer, true, false);

			taken.add(initializerValue);
			if (memberName != null) members[memberName] = initializerValue;
		});

		const map: IEnumDeclaration = {
			___kind: IdentifierMapKind.ENUM,
			startsAt,
			endsAt,
			name,
			members,
			filePath,
			decorators: this.decoratorsFormatter.format(statement)
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.ENUM,
			enumerable: false
		});
		this.mapper.set(map, statement);
		this.cache.setCachedEnum(filePath, map);
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