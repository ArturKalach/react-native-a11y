//
//  RCA11yFocusGuideHelper.h
//  react-native-a11y
//

#ifndef RCA11yFocusGuideHelper_h
#define RCA11yFocusGuideHelper_h

#import <UIKit/UIKit.h>
typedef NS_ENUM(NSUInteger, RCA11yFocusGuideDirection) {
    RCA11yFocusGuideDirectionLeft,
    RCA11yFocusGuideDirectionRight,
    RCA11yFocusGuideDirectionUp,
    RCA11yFocusGuideDirectionDown,
};

@interface RCA11yFocusGuideHelper : NSObject

+ (UIFocusGuide *)createGuideWithView:(UIView *)containerView
                            focusView:(UIView *)focusView
                              enabled:(BOOL)enabled;

+ (UIFocusGuide *)setGuideForDirection:(RCA11yFocusGuideDirection)direction
                              inView:(UIView *)containerView
                          focusView:(UIView *)focusView
                            enabled:(BOOL)enabled;

@end

#endif /* RCA11yFocusGuideHelper_h */
