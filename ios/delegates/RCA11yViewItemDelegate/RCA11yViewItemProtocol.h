//
//  RCA11yViewItemProtocol.h
//  react-native-a11y
//

#ifndef RCA11yViewItemProtocol_h
#define RCA11yViewItemProtocol_h

@protocol RCA11yViewItemProtocol <NSObject>

- (void)onFocusItemLinked: (UIView*)view;
- (void)onFocusItemRemoved: (UIView*)view;

@end

#endif /* RCA11yViewItemProtocol_h */
