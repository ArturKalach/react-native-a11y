//
//  RCA11yDebouncer.h
//  react-native-a11y
//

#ifndef RCA11yDebouncer_h
#define RCA11yDebouncer_h

@interface RCA11yDebouncer: NSObject

- (instancetype)initWithInterval:(NSTimeInterval)interval;

@property (nonatomic, strong) dispatch_queue_t queue;
@property (nonatomic, copy) void (^debounceBlock)(void);
@property (nonatomic, assign) NSTimeInterval debounceInterval;

- (void)debounceAction:(void (^)(void))action;

@end

#endif /* RCA11yDebouncer_h */
