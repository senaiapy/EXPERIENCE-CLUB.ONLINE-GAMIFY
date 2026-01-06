import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Game = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15a7 7 0 100-14 7 7 0 000 14z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"
    />
  </Svg>
);
