import {IMarshaller, Marshaller} from "@wessberg/marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import * as TypeMoq from "typemoq";
import {ArbitraryValueIndexable, InitializationValue, ISimpleLanguageService} from "../../src/service/interface/ISimpleLanguageService";
import {SimpleLanguageService} from "../../src/service/SimpleLanguageService";
const Mock = TypeMoq.Mock;
const It = TypeMoq.It;

// Setup
export const fileName = "a_file.ts";
const INTEGRATION_TEST = process.env.npm_config_integration === "true";
export let marshaller = Mock.ofType<IMarshaller>();
let marshallerIntegrated = new Marshaller(new TypeDetector());
let service: ISimpleLanguageService;

// Helpers
export const parse = (code: string, file: string = fileName) => service.addFile(file, code);

export function setupMock<T> (input?: InitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	if (input != null || treatUndefinedAsExpectedValue) {
		let out: T | undefined;
		if (output == null) {
			if (treatUndefinedAsExpectedValue) out = output;
			else out = <T>input;
		} else out = output;

		marshaller.setup(marshaller => marshaller.marshal<InitializationValue | ArbitraryValueIndexable, T | undefined>(input)).returns(() => out);
		marshaller.setup(marshaller => marshaller.marshal<InitializationValue | ArbitraryValueIndexable, any>(input, It.isAny())).returns(() => out);
	}
}

export function setup<T> (input?: InitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	if (INTEGRATION_TEST) {
		service = new SimpleLanguageService(marshallerIntegrated);
	} else {
		marshaller = Mock.ofType<IMarshaller>();
		setupMock<T>(input, output, treatUndefinedAsExpectedValue);
		service = new SimpleLanguageService(marshaller.object);
	}

}

export function setupMany (inputOutputs: [InitializationValue | ArbitraryValueIndexable, InitializationValue | ArbitraryValueIndexable][], treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	if (INTEGRATION_TEST) {
		service = new SimpleLanguageService(marshallerIntegrated);
	} else {
		marshaller = Mock.ofType<IMarshaller>();
		inputOutputs.forEach(pair => setupMock<typeof pair[1]>(pair[0], pair[1], treatUndefinedAsExpectedValue));
		service = new SimpleLanguageService(marshaller.object);
	}
}

export {service};