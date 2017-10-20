import {Modifier, Node, NodeArray} from "typescript";
import {ModifierKind} from "../../light-ast/dict/modifier/modifier-kind";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";

export interface IModifierService {
	getModifierName (modifier: Modifier): string;
	hasModifierWithName (name: string, node: Node): boolean;
	createModifierFromString (modifier: ModifierKind): Modifier;
	createModifiersFromStrings (modifiers: Iterable<ModifierKind>): NodeArray<Modifier>;
	createVisibilityModifier (modifier: VisibilityKind): Modifier;
	createConstModifier (): Modifier;
	createDeclareModifier (): Modifier;
	createDefaultModifier (): Modifier;
	createExportModifier (): Modifier;
	createReadonlyModifier (): Modifier;
	createPrivateModifier (): Modifier;
	createPublicModifier (): Modifier;
	createProtectedModifier (): Modifier;
	createAsyncModifier (): Modifier;
	createStaticModifier (): Modifier;
	createAbstractModifier (): Modifier;
	isStatic (node: Node): boolean;
	isAsync (node: Node): boolean;
	isAbstract (node: Node): boolean;
	isReadonly (node: Node): boolean;
	isConst (node: Node): boolean;
	isExported (node: Node): boolean;
	isDefaultExported (node: Node): boolean;
	isPrivate (node: Node): boolean;
	isProtected (node: Node): boolean;
	isPublic (node: Node): boolean;
	isDeclared (node: Node): boolean;
	isDefault (node: Node): boolean;
}