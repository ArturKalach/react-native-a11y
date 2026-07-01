//
//  RCA11yHaloDelegate.h
//  react-native-a11y
//

#ifndef RCA11yHaloDelegate_h
#define RCA11yHaloDelegate_h

#import <Foundation/Foundation.h>
#import "RCA11yHaloProtocol.h"

@interface RCA11yHaloDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RCA11yHaloProtocol> *_Nonnull)view;

@property (nonatomic, readonly, nullable) UIFocusEffect *focusEffect API_AVAILABLE(ios(15.0));
- (void)invalidate;
- (void)clear;

@end

#endif /* RCA11yHaloDelegate_h */
