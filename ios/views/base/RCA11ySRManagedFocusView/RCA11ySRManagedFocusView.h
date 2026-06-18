//
//  RCA11ySRManagedFocusView.h
//  react-native-a11y
//
//  Screen-reader managed focus + descendant focus events (ported from
//  react-native-a11y-order's RNAOA11yManagedFocusView).
//

#ifndef RCA11ySRManagedFocusView_h
#define RCA11ySRManagedFocusView_h

#import "RCA11ySRGroupChildrenView.h"
#import "RCA11yFocusService.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCA11ySRManagedFocusView : RCA11ySRGroupChildrenView<RCA11yFocusServiceSubscriber>
@property BOOL descendantFocusChangedEnabled;
/// Screen-reader focus on this view (UIAccessibility layout-changed). Distinct
/// from `-focus`, which is keyboard focus in the merged hierarchy.
- (void)focusView;
#ifndef RCT_NEW_ARCH_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onScreenReaderDescendantFocusChanged;
@property (nonatomic, copy) RCTDirectEventBlock onScreenReaderFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onScreenReaderFocused;
#endif
@end

NS_ASSUME_NONNULL_END

#endif /* RCA11ySRManagedFocusView_h */
