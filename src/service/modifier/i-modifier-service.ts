import {Modifier, ModifiersArray, Node, NodeArray} from "typescript";
import {ModifierKind} from "../../light-ast/dict/modifier/modifier-kind";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";

export interface IModifierService {
	getModifierName (modifier: Modifier): string;
	hasModifierWithName (name: string, node: Node|ModifiersArray): boolean;
	sortModifiers (modifiers: ModifiersArray): ModifiersArray;
	getAccessModifier (node: Node|ModifiersArray): VisibilityKind|undefined;
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
	isStatic (node: Node|ModifiersArray): boolean;
	isAsync (node: Node|ModifiersArray): boolean;
	isAbstract (node: Node|ModifiersArray): boolean;
	isReadonly (node: Node|ModifiersArray): boolean;
	isConst (node: Node|ModifiersArray): boolean;
	isExported (node: Node|ModifiersArray): boolean;
	isDefaultExported (node: Node|ModifiersArray): boolean;
	isPrivate (node: Node|ModifiersArray): boolean;
	isProtected (node: Node|ModifiersArray): boolean;
	isPublic (node: Node|ModifiersArray): boolean;
	isDeclared (node: Node|ModifiersArray): boolean;
	isDefault (node: Node|ModifiersArray): boolean;
}