//
//  RCA11yFocusSequenceDelegate.h
//  react-native-a11y
//

#ifndef RCA11yFocusSequenceDelegate_h
#define RCA11yFocusSequenceDelegate_h

#import <Foundation/Foundation.h>
#import "RCA11yFocusOrderProtocol.h"

@interface RCA11yFocusSequenceDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RCA11yFocusOrderProtocol> *_Nonnull)view;

- (NSNumber *_Nullable)shouldUpdateFocusInContext:(UIFocusUpdateContext *_Nonnull)context;

- (void)link;
- (void)unlink;
- (void)updatePosition:(NSNumber *_Nullable)position;
- (void)updateOrderGroup:(NSString *_Nullable)orderGroup;

@end

#endif /* RCA11yFocusSequenceDelegate_h */
