//
//  RCA11yViewGroupBase.h
//  react-native-a11y
//
//  Bottom of the merged keyboard base chain (ported from EK RNCEKVViewGroupBase).
//

#ifndef RCA11yViewGroupBase_h
#define RCA11yViewGroupBase_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTViewComponentView.h>
  #define RCA11yBaseViewClass RCTViewComponentView
#else
  #import <React/RCTView.h>
  #define RCA11yBaseViewClass RCTView
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RCA11yViewGroupBase : RCA11yBaseViewClass

- (UIView*)getStoredView;
- (void)onSubviewAdded:(UIView *)subview;
- (void)onSubviewRemoved:(UIView *)subview;
- (void)onSubviewsLayoutUpdated;

- (BOOL)focusableWrapper;

- (void)cleanReferences;

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11yViewGroupBase_h */
