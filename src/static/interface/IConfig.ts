export interface INameConfig {
	anonymous: string;
	global: string;
}

export interface IConfig {
	name: INameConfig;
	supportedFileExtensions: string[];
	defaultExtension: string;
	builtIns: Set<string>;
	builtInIdentifiers: Set<string>;
}