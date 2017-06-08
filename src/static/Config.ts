import {IConfig} from "./interface/IConfig";
import {IdentifierIntelligence, PathIntelligence} from "@wessberg/compiler-common";

export const Config: IConfig = {
	name: {
		global: "global",
		anonymous: "__anonymous__"
	},
	supportedFileExtensions: [".ts", ".js"],
	defaultExtension: ".ts",
	builtIns: new Set(PathIntelligence.builtIn),
	builtInIdentifiers: new Set(IdentifierIntelligence.builtIn)
};