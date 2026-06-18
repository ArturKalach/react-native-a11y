//
//  RCA11yFocusLinkObserver.h
//  react-native-a11y
//

#ifndef RCA11yFocusLinkObserver_h
#define RCA11yFocusLinkObserver_h
#import "RCA11yOrderSubscriber.h"

@interface RCA11yFocusLinkObserver : NSObject

@property (nonatomic, strong, readonly) RCA11yFocusLinkObserver *focusLinkObserver;

+ (instancetype)sharedManager;

- (void)emitWithId:(NSString *)identifier link:(UIView *)link;
- (void)emitRemoveWithId:(NSString *)identifier;

- (RCA11yOrderSubscriber*)subscribe:(NSString *)identifier
          onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
          onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

- (void)unsubscribeWithId:(NSString *)identifier
            onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
            onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

- (void)unsubscribe:(RCA11yOrderSubscriber *)subscriber;

@end

#endif /* RCA11yFocusLinkObserver_h */
