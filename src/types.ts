import React, { ElementType } from 'react';

/* MAIN TYPES */
// TODO: make so that variants key could not have name of any prop of the component
// For now it seems to be impossible in TypeScript
export type VariantsConfigSchema<T extends ElementType,
  TBaseVariants extends Record<string, string[]> = Record<string, string[]>,
  > = {
  [KVariant in keyof TBaseVariants]: {
    [KVariantValue in TBaseVariants[KVariant][number]]: PartialProps<T>;
  };
} & Record<string, Record<string, PartialProps<T>>>;
export type ConfigVariants<T extends ElementType,
  TVariantsSchema extends VariantsConfigSchema<T>,
  > = {
  [Variant in keyof TVariantsSchema]?: keyof TVariantsSchema[Variant];
};

export interface ConfigWithVariants<T extends ElementType> {
  baseConfig: PartialProps<T>;
  variants: VariantsConfigSchema<T>;
}

export type ComponentConfig<T extends ElementType> = PartialProps<T>;
export type FuncComponentConfig<T extends ElementType, TConfig extends ComponentConfig<T>> = (
  componentProps: React.ComponentProps<T>,
) => TConfig;
// I'm not really sure how is this working, but it is.
// Basically, it makes so that if prop is specified in the config, the props became optional
// TODO: defaultVariants don't count here, should be fixed
// NB: for any kind of default variants we can't leave out this type and its functionality;
// to do so, we would probably need to pass default variants `as const`
export type ConfiguredProps<T extends ElementType, TConfig extends ComponentConfig<T>> = SomePartialProps<T,
  keyof TConfig>;

export interface ConfiguredOptions<T extends ElementType> {
  mergeProps: (propsLeft: PartialProps<T>, propsRight: PartialProps<T>) => PartialProps<T>;
}


/* UTIL TYPES */
export type PartialProps<T extends ElementType> = Partial<React.ComponentProps<T>>;
export type SomePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type SomePartialProps<
  T extends ElementType,
  K extends keyof TProps,
  TProps extends React.ComponentProps<T> = React.ComponentProps<T>,
> = Omit<TProps, K> & Partial<Pick<TProps, K>>;
