//
//  RCA11yViewItemDelegate.h
//  react-native-a11y
//

#ifndef RCA11yViewItemDelegate_h
#define RCA11yViewItemDelegate_h

#import "RCA11yViewItemProtocol.h"

@interface RCA11yViewItemDelegate : NSObject

- (instancetype _Nonnull)initWithView:
(UIView<RCA11yViewItemProtocol> *_Nonnull)delegate;

@property (nonatomic, weak) UIView *linkView;

- (void)willRemoveSubview:(UIView *)subview;
- (void)didAddSubview:(UIView *)subview;
- (void)finalizeUpdates;
- (void)prepareForRecycle;
- (void)layoutSubviews;

@end

#endif /* RCA11yViewItemDelegate_h */
