import React from 'react';
import { View } from 'react-native';
import type { A11yFocusGroupProps } from './A11yFocusGroup.types';

/** Default/web: a focus group has no effect outside iOS — render a plain View. */
export const A11yFocusGroup = View as unknown as React.FC<A11yFocusGroupProps>;
