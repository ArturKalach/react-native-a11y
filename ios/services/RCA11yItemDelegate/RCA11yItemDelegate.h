//
//  RCA11yItemDelegate.h
//  react-native-a11y
//

#ifndef RCA11yItemDelegate_h
#define RCA11yItemDelegate_h

#import "RCA11yViewItemProtocol.h"

@interface RCA11yItemDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RCA11yViewItemProtocol> *_Nonnull)delegate;

@property (nonatomic, weak) UIView *linkView;
@property (nonatomic, strong) NSNumber *position;
@property (nonatomic, copy) NSString *orderKey;
@property (nonatomic, strong) NSNumber *orderFocusType;

- (void)willRemoveSubview:(UIView *)subview;
- (void)didAddSubview:(UIView *)subview;
- (void)finalizeUpdates;
- (void)clear;
- (void)prepareForRecycle;

@end

#endif /* RCA11yItemDelegate_h */
