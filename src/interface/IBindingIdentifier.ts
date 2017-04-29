import { ArbitraryValue } from "src/interface/ISimpleLanguageService";

export interface IBindingIdentifier {
	name: string;
	path: ArbitraryValue[] | null;
	flattenPath(): string;
}