import { keys, omit } from '@appello/common/lib/utils/object';
import React, { ElementType } from 'react';

import { ComponentConfig, ConfiguredOptions, ConfiguredProps, FuncComponentConfig, PartialProps } from './types';
import { mergeProps as mergePropsDefault } from './utils';

// type ForwardRef<T, P> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

// type InferRef<T> = T extends RefAttributes<infer R> | ClassAttributes<infer R> ? R : unknown;

// TODO: implement boolean variants
// TODO2: maybe we should leave baseConfig even when there is no variants
export function configured<T extends ElementType, TConfig extends ComponentConfig<T>>(
  component: T,
  config: TConfig | FuncComponentConfig<T, TConfig>,
  { mergeProps = mergePropsDefault }: ConfiguredOptions<T> = {
    mergeProps: mergePropsDefault,
  },
): React.FC<ConfiguredProps<T, TConfig>> {
  const Component = component;

  const Configured: React.FC<ConfiguredProps<T, TConfig>> = props => {
    const resolvedConfig =
      typeof config === 'function' ? config(props as React.ComponentProps<T>) : config;

    const baseConfig = (
      'baseConfig' in resolvedConfig ? resolvedConfig.baseConfig : resolvedConfig
    ) as PartialProps<T>;
    const variants =
      'variants' in resolvedConfig && resolvedConfig.variants ? resolvedConfig.variants : {};

    const restProps = omit(props, keys(variants)) as React.ComponentProps<T>;
    const variantsList = keys(variants);

    const combinedProps = variantsList.reduce<PartialProps<T>>((acc, variant) => {
      // eslint-disable-next-line react/destructuring-assignment
      const variantValue = props[variant];
      if (variantValue) {
        const variantProps = variants[variant][variantValue];
        return mergeProps(acc, variantProps);
      }
      return acc;
    }, baseConfig);

    return <Component {...(mergeProps(combinedProps, restProps) as React.ComponentProps<T>)} />;
  };

  return Configured;
}
