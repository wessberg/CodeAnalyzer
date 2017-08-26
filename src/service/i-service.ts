import {SyntaxKind} from "typescript";

export interface IService {
	supportedKinds?: Set<SyntaxKind>;
}