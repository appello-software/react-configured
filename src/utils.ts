import { ElementType } from 'react';

import { PartialProps, ComponentConfig } from './types';

export const mergeProps = <
  T extends ElementType,
  TProps extends PartialProps<T>,
  TSecondProps extends PartialProps<T>,
>(
  baseProps: TProps,
  variantProps: TSecondProps,
): TProps | TSecondProps => ({
  ...baseProps,
  ...variantProps,
});

/* TODO:
 *  configs with variants actually should be partial, so that we could
 *  change only `baseConfig` for example
 * */
export function combineConfigs<
  T extends ElementType,
  TConfig extends ComponentConfig<T>,
  TLeftConfig extends TConfig = TConfig,
  TRightConfig extends TConfig = TConfig,
>(leftConfig: TLeftConfig, rightConfig?: TRightConfig): TConfig {
  if (!rightConfig) return leftConfig;

  const isLeftConfigWithVariants = 'baseConfig' in leftConfig && 'variants' in leftConfig;
  const isRightConfigWithVariants = 'baseConfig' in rightConfig && 'variants' in rightConfig;

  if (!isLeftConfigWithVariants || isRightConfigWithVariants) {
    return rightConfig;
  }

  return {
    ...leftConfig,
    ...(rightConfig as TRightConfig),
  };
}
