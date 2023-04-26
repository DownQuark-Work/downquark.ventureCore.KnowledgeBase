export type CreateGetters<Type> = { [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property] };
export type CreateImmutable<Type> = { +readonly [Property in keyof Type]: Type[Property]; };
export type CreateMutable<Type> = { -readonly [Property in keyof Type]: Type[Property]; };
export type OneOrMany<Type> = Type | Type[];
export type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
export type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
export type OrNull<Type> = Type | null;
export type OrUndefined<Type> = Type | undefined;
export type StringKeys<T> = keyof T;
export type StringMap<T> = { [P in keyof T]: string };
export type ValidateEnum<SourceOfTruth, TypeOfEnum> = Extract<SourceOfTruth, keyof TypeOfEnum>;

export enum enumMessageType {
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE_BLOCKCHAIN = 2,
}
