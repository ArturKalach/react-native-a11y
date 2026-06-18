//
//  UIViewController+RCA11y.h
//  react-native-a11y
//
//  Merged category — unifies react-native-a11y-order's UIViewController+RNAOA11yOrder
//  (screen-reader focus save/restore + announce lock) and
//  react-native-external-keyboard's UIViewController+RNCEKVExternalKeyboard
//  (preferredFocusEnvironments custom focus + view-controller-changed notification).
//
//  Both packages swizzled `viewDidAppear:`; merging into ONE category swizzles it a
//  single time (no two swizzle paths fighting over the same method).
//

#ifndef UIViewController_RCA11y_h
#define UIViewController_RCA11y_h

#import <UIKit/UIKit.h>

@interface UIViewController (RCA11y)
@property (nonatomic, strong) UIView *rca11yCustomFocusView;
- (void)rca11yFocusView:(UIView *)view;
- (void)setRca11yFocusRestore:(BOOL)focusRestore;
@end

#endif /* UIViewController_RCA11y_h */
