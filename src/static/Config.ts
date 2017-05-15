import {IConfig} from "./interface/IConfig";

export const Config: IConfig = {
	name: {
		global: "global",
		anonymous: "__anonymous__"
	},
	supportedFileExtensions: [".ts", ".js"],
	defaultExtension: ".ts",
	builtIns: new Set(["fs", "path", "buffer", "assert", "child_process", "cluster", "http", "https", "os", "crypto", "dns", "domain", "events", "net", "process", "punycode", "querystring", "readline", "repl", "stream", "string_decoder", "timers", "tls", "tty", "dgram", "url", "util"])
};