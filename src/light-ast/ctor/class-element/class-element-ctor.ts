import {ClassAccessorCtor} from "../class-accessor/class-accessor-ctor";
import {IClassPropertyCtor} from "../class-property/i-class-property-ctor";
import {IConstructorCtor} from "../constructor/i-constructor-ctor";
import {IClassMethodCtor} from "../class-method/i-class-method-ctor";

export declare type ClassElementCtor = ClassAccessorCtor|IClassPropertyCtor|IClassMethodCtor|IConstructorCtor;