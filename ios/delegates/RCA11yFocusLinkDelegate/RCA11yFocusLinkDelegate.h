//
//  RCA11yFocusLinkDelegate.h
//  react-native-a11y
//

#ifndef RCA11yFocusLinkDelegate_h
#define RCA11yFocusLinkDelegate_h

#import <Foundation/Foundation.h>
#import "RCA11yFocusOrderProtocol.h"
#import "RCA11yFocusGuideHelper.h"

@interface RCA11yFocusLinkDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RCA11yFocusOrderProtocol> *_Nonnull)view;

- (NSNumber *_Nullable)shouldUpdateFocusInContext:(UIFocusUpdateContext *_Nonnull)context;

- (void)link;
- (void)unlink;

- (void)linkId;
- (void)refreshId:(NSString *_Nullable)prev next:(NSString *_Nullable)next;
- (void)setIsFocused:(BOOL)value;

- (void)refreshLeft:(NSString *_Nullable)next;
- (void)refreshRight:(NSString *_Nullable)next;
- (void)refreshUp:(NSString *_Nullable)next;
- (void)refreshDown:(NSString *_Nullable)next;

- (void)clear;

@end

#endif /* RCA11yFocusLinkDelegate_h */
