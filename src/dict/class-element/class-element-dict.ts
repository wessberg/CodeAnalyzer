import {ClassAccessorDict} from "../class-accessor/class-accessor-dict";
import {IClassPropertyDict} from "../class-property/i-class-property-dict";
import {IConstructorDict} from "../constructor/i-constructor-dict";
import {IClassMethodDict} from "../class-method/i-class-method-dict";

export declare type ClassElementDict = ClassAccessorDict|IClassPropertyDict|IClassMethodDict|IConstructorDict;