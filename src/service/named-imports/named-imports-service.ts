import {INamedImportsService} from "./i-named-imports-service";
import {ImportSpecifier, NamedImports} from "typescript";
import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";
import {isINamedImportExportDict} from "../../dict/named-import-export/is-i-named-import-export-dict";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IFormatter} from "../../formatter/i-formatter-getter";

/**
 * A service for working with NamedImports
 */
export class NamedImportsService implements INamedImportsService {
	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner) {}

	/**
	 * Returns true if the given NamedImports has an import with the provided name
	 * @param {string|INamedImportExportDict|ImportSpecifier} name
	 * @param {NamedImports} namedImports
	 * @returns {boolean}
	 */
	public hasImportWithName (name: string|INamedImportExportDict|ImportSpecifier, namedImports: NamedImports): boolean {
		const normalizedName = typeof name === "string" ? name : isINamedImportExportDict(name) ? name.name : name.name.text;
		const propertyName = typeof name === "string" ? undefined : isINamedImportExportDict(name) ? name.propertyName : name.propertyName == null ? undefined : name.propertyName.text;

		return namedImports.elements.some(element => {
			const matchesName = element.name.text === normalizedName;
			const hasNoProperty = element.propertyName == null && propertyName == null;
			return matchesName && (hasNoProperty || (element.propertyName != null && element.propertyName.text === propertyName));
		});
	}

	/**
	 * Adds an import to some NamedImports
	 * @param {string | INamedImportExportDict} name
	 * @param {NamedImports} namedImports
	 * @returns {NamedImports}
	 */
	public addImportToNamedImports (name: string|INamedImportExportDict, namedImports: NamedImports): NamedImports {
		// If the NamedImports already includes the provided name, return the existing one
		if (this.hasImportWithName(name, namedImports)) {
			return namedImports;
		}

		const normalizedName = typeof name === "string" ? name : name.name;
		const propertyName = typeof name === "string" ? null : name.propertyName;

		// Format some new NamedImports
		const newNamedImports = this.formatter.formatNamedImports({name: normalizedName, propertyName});

		return this.updater.updateNamedImportsElements(
			this.joiner.joinNamedImports(newNamedImports, namedImports).elements,
			namedImports
		);
	}
}