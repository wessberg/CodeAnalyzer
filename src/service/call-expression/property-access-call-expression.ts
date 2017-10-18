import {CallExpression, PropertyAccessExpression} from "typescript";

export declare type PropertyAccessCallExpression = CallExpression & {expression: PropertyAccessExpression};