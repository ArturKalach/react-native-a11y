//
//  RCA11yFocusProtocol.h
//  react-native-a11y
//

#ifndef RCA11yFocusProtocol_h
#define RCA11yFocusProtocol_h

#import <UIKit/UIKit.h>

@protocol RCA11yFocusProtocol <NSObject>
- (BOOL)canBeFocused;
- (BOOL)focusableWrapper;
@end

#endif /* RCA11yFocusProtocol_h */
