//
//  RCA11yHaloProtocol.h
//  react-native-a11y
//

#ifndef RCA11yHaloProtocol_h
#define RCA11yHaloProtocol_h

#import <UIKit/UIKit.h>

@protocol RCA11yHaloProtocol <NSObject>
- (BOOL)isHaloHidden;
- (CGFloat) haloCornerRadius;
- (CGFloat) haloExpendX;
- (CGFloat) haloExpendY;
- (BOOL) roundedHaloFix;
- (UIView*) getFocusTargetView;
@end

#endif /* RCA11yHaloProtocol_h */
