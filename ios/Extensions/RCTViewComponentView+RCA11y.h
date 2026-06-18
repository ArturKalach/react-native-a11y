//
//  RCTViewComponentView+RCA11y.h
//  react-native-a11y
//
//  Keyboard focus overrides on the RN host view (ported from
//  react-native-external-keyboard's RCTViewComponentView+RNCEKVExternalKeyboard):
//  focusGroupIdentifier / focusEffect / canBecomeFocused defer to an A11y parent.
//  The screen-reader focus-delegate storage + accessibility swizzle live in the
//  separate UIView+RCA11y category (they apply to any accessible child view).
//

#ifndef RCTViewComponentView_RCA11y_h
#define RCTViewComponentView_RCA11y_h

#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTViewComponentView.h>
  #define RCA11yViewClass RCTViewComponentView
#else
  #import <React/RCTView.h>
  #define RCA11yViewClass RCTView
#endif

@interface RCA11yViewClass (RCA11y)
@end

#endif /* RCTViewComponentView_RCA11y_h */
