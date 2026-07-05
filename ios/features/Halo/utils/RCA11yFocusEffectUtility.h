//
//  RCA11yFocusEffectUtility.h
//  react-native-a11y
//

#ifndef RCA11yFocusEffectUtility_h
#define RCA11yFocusEffectUtility_h

#import <UIKit/UIKit.h>

@interface RCA11yFocusEffectUtility : NSObject

+ (UIFocusEffect *)emptyFocusEffect API_AVAILABLE(ios(15.0));
+ (UIFocusEffect *)getFocusEffect:(UIView *)effectView
                    withExpandedX:(CGFloat)expandedX
                    withExpandedY:(CGFloat)expandedY
                    withCornerRadius:(CGFloat)cornerRadius API_AVAILABLE(ios(15.0));

@end

#endif /* RCA11yFocusEffectUtility_h */
