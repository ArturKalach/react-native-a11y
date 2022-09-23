import React, {useState, useMemo} from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeFocusWrapper, OnFocusChangeFn } from './RCA11yFocusWrapper';
import { useCanBeFocused } from '../../providers';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';




export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(({canBeFocused, onFocusChange, focusStyle, children, style, withView = true, ...props}, ref) => {
  const canBecomeFocused = useCanBeFocused()
  const [focused, setFocusStatus] = useState(false);

  const onFocusChangeHandler: OnFocusChangeFn = event => {
    setFocusStatus(event.nativeEvent.isFocused);
    onFocusChange?.(event);
  }

  const wrapperStyle = useMemo(() => {
    if(!focusStyle) return focused ? styles.defaultHighlight : undefined;
    return typeof focusStyle === 'function' ? focusStyle({ focused }) : focusStyle
  }, [focused, focusStyle])

  return <NativeFocusWrapper onFocusChange={onFocusChangeHandler} style={[style, wrapperStyle]} canBeFocused={canBecomeFocused && canBeFocused} {...props} ref={ref}>
    {withView ? <View accessible>{children}</View> : children}
  </NativeFocusWrapper>
})

const styles = StyleSheet.create({
  defaultHighlight: { backgroundColor: '#9999' },
});
