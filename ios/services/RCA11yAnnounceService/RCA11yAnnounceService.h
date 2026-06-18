//
//  RCA11yAnnounceService.h
//  react-native-a11y
//

#ifndef RCA11yAnnounceService_h
#define RCA11yAnnounceService_h

#import <UIKit/UIKit.h>
#import "RCA11yFocusChangeListener.h"

@interface RCA11yAnnounceService: NSObject<RCA11yFocusChangeListenerDelegate>

+ (instancetype)shared;

/**
 * Enqueues `announcement` and schedules a navigation-aware debounced post.
 * `onFired` is called on the main queue when the service actually speaks
 * the announcement. Pass nil if no completion callback is needed.
 * If cancelAll is called before the service fires, `onFired` is NOT called.
 */
- (void)announce:(NSString *)announcement onFired:(nullable dispatch_block_t)onFired;

/** Convenience — equivalent to announce:onFired:nil. */
- (void)announce:(NSString *)announcement;

- (void)cancelAll;
- (void)temporarilyLockAnnounce;
- (void)temporarilyLockAnnounce:(NSTimeInterval)interval;

@end

#endif /* RCA11yAnnounceService_h */
