import {INamespaceImportService} from "./i-namespace-import-service";
import {NamespaceImport} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IUpdater} from "../../updater/i-updater-getter";

/**
 * A service for working with NamespaceImports
 */
export class NamespaceImportService implements INamespaceImportService {
	constructor (private readonly formatter: IFormatter,
							 private readonly updater: IUpdater) {
	}

	/**
	 * Gets the name of a NamespaceImport
	 * @param {NamespaceImport} namespaceImport
	 * @returns {string}
	 */
	public getNameOfNamespace (namespaceImport: NamespaceImport): string {
		return namespaceImport.name.text;
	}

	/**
	 * Changes the name of a NamespaceImport
	 * @param {string} name
	 * @param {NamespaceImport} namespaceImport
	 * @returns {NamespaceImport}
	 */
	public changeNameOfNamespace (name: string, namespaceImport: NamespaceImport): NamespaceImport {
		// Generate a new NamespaceImport
		const newName = this.formatter.formatIdentifier(name);
		return this.updater.updateNamespaceImportName(newName, namespaceImport);
	}
}