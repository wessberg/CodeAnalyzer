import {INamedExportsService} from "./i-named-exports-service";
import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";
import {ExportSpecifier, NamedExports} from "typescript";
import {isINamedImportExportDict} from "../../dict/named-import-export/is-i-named-import-export-dict";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * A service for working with NamedExports
 */
export class NamedExportsService implements INamedExportsService {
	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner) {}

	/**
	 * Returns true if the given NamedExports contains an export matching the provided name
	 * @param {string | INamedImportExportDict | ExportSpecifier} name
	 * @param {NamedExports} namedExports
	 * @returns {boolean}
	 */
	public hasExportWithName (name: string|INamedImportExportDict|ExportSpecifier, namedExports: NamedExports): boolean {
		const normalizedName = typeof name === "string" ? name : isINamedImportExportDict(name) ? name.name : name.name.text;
		const propertyName = typeof name === "string" ? undefined : isINamedImportExportDict(name) ? name.propertyName : name.propertyName == null ? undefined : name.propertyName.text;

		return namedExports.elements.some(element => {
			const matchesName = element.name.text === normalizedName;
			const hasNoProperty = element.propertyName == null && propertyName == null;
			return matchesName && (hasNoProperty || (element.propertyName != null && element.propertyName.text === propertyName));
		});
	}

	/**
	 * Adds an NamedExport to the provided NamedExports
	 * @param {string | INamedImportExportDict} name
	 * @param {NamedExports} namedExports
	 * @returns {NamedExports}
	 */
	public addNamedExportToNamedExports (name: string|INamedImportExportDict, namedExports: NamedExports): NamedExports {
		// If the NamedExports already includes the provided name, return the existing one
		if (this.hasExportWithName(name, namedExports)) {
			return namedExports;
		}

		const normalizedName = typeof name === "string" ? name : name.name;
		const propertyName = typeof name === "string" ? null : name.propertyName;

		// Format some new NamedExports
		const newNamedExports = this.formatter.formatNamedExports({name: normalizedName, propertyName});

		return this.updater.updateNamedExportsElements(
			this.joiner.joinNamedExports(newNamedExports, namedExports).elements,
			namedExports
		);
	}

}