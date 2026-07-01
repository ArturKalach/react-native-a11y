//
//  RCA11yFocusDelegate.h
//  react-native-a11y
//

#ifndef RCA11yFocusDelegate_h
#define RCA11yFocusDelegate_h

#import <Foundation/Foundation.h>
#import "RCA11yFocusProtocol.h"

@interface RCA11yFocusDelegate : NSObject

- (instancetype _Nonnull )initWithView:(UIView<RCA11yFocusProtocol> *_Nonnull)view;

- (UIView*_Nonnull)getFocusingView;
- (BOOL)canBecomeFocused;
- (nullable NSNumber*)isFocusChanged:(UIFocusUpdateContext *_Nonnull)context;
/** Clears the captured focused view; call on view recycle. */
- (void)reset;

@end

#endif /* RCA11yFocusDelegate_h */
