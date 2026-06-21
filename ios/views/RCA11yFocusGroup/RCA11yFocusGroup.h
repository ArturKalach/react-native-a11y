//
//  RCA11yFocusGroup.h
//  react-native-a11y
//
//  iOS keyboard focus group backing `A11y.FocusGroup` (ported from
//  react-native-external-keyboard's RNCEKVKeyboardFocusGroup).
//

#ifndef RCA11yFocusGroup_h
#define RCA11yFocusGroup_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RCA11yFocusGroup : RCTViewComponentView
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property (nonatomic, strong, nullable) NSString *orderGroup;
@property BOOL isGroupFocused;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RCA11yFocusGroup : RCTView
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property (nonatomic, strong, nullable) NSString *orderGroup;
@property BOOL isGroupFocused;
@property (nonatomic, copy) RCTDirectEventBlock onGroupFocusChange;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RCA11yFocusGroup_h */
