//
//  RCA11yFocusService.h
//  react-native-a11y
//

#ifndef RCA11yFocusService_h
#define RCA11yFocusService_h

#import <UIKit/UIKit.h>

@protocol RCA11yFocusServiceSubscriber <NSObject>
- (void)accessibilityElementDidBecomeFocused:(UIView*)view;
- (void)accessibilityElementDidUnfocused:(UIView*)view;
@end

@interface RCA11yFocusService : NSObject

+ (instancetype)sharedService;
- (void)subscribe:(UIView<RCA11yFocusServiceSubscriber> *)subscriber;
- (void)unsubscribe:(UIView<RCA11yFocusServiceSubscriber> *)subscriber;
@end

#endif /* RCA11yFocusService_h */
