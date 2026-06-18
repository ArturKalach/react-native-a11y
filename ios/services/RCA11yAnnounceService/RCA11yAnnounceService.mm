//
//  RCA11yAnnounceService.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yAnnounceService.h"
#import "RCA11yDebouncer.h"
#import "RCA11yAnnounceQueue.h"
#import "RCA11yFocusChangeListener.h"
#import "RCA11yAnnounceHelper.h"

@interface RCA11yAnnounceService ()
@property (nonatomic, assign) BOOL isVoiceOverNulled;
@property (nonatomic, assign) BOOL isAnnounceLocked;
@property (nonatomic, strong) RCA11yDebouncer *announceDebouncer;
@property (nonatomic, strong) RCA11yDebouncer *lockReleaseDebouncer;
@property (nonatomic, strong) RCA11yAnnounceQueue *announceQueue;
@property (nonatomic, strong) RCA11yFocusChangeListener *voiceOverFocusListener;
// One callback per announce:onFired: call (FIFO). Fired when the batch posts.
// Dropped without calling on cancelAll — module resolves those promises as 'cancelled'.
@property (nonatomic, strong) NSMutableArray<dispatch_block_t> *onFiredCallbacks;
@property (nonatomic, assign, readonly) BOOL canAnnounce;
@end

@implementation RCA11yAnnounceService

#pragma mark - Singleton

+ (instancetype)shared {
  static RCA11yAnnounceService *instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{ instance = [self new]; });
  return instance;
}

- (instancetype)init {
  if (self = [super init]) {
    _isVoiceOverNulled    = YES;
    _announceDebouncer    = [[RCA11yDebouncer alloc] initWithInterval:0.3];
    _lockReleaseDebouncer = [[RCA11yDebouncer alloc] initWithInterval:1.0];
    _announceQueue        = [RCA11yAnnounceQueue new];
    _onFiredCallbacks     = [NSMutableArray new];
    _voiceOverFocusListener = [[RCA11yFocusChangeListener alloc] initWithDelegate:self];
    [_voiceOverFocusListener startListening];
  }
  return self;
}

- (void)dealloc { [_voiceOverFocusListener stopListening]; }

- (BOOL)canAnnounce {
  return !self.announceQueue.isEmpty && !self.isAnnounceLocked && !self.isVoiceOverNulled;
}

#pragma mark - Focus delegate

- (void)voiceOverFocusChanged:(id)focusedElement {
  self.isVoiceOverNulled = (focusedElement == nil);
  [self _scheduleAnnounce];
}

#pragma mark - Lock

- (void)temporarilyLockAnnounce {
  [self temporarilyLockAnnounce:1.0];
}

- (void)temporarilyLockAnnounce:(NSTimeInterval)interval {
  self.isAnnounceLocked = YES;
  // Interval must be set before debounceAction: — it is read at call time.
  self.lockReleaseDebouncer.debounceInterval = interval;
  __weak RCA11yAnnounceService *weakSelf = self;
  [self.lockReleaseDebouncer debounceAction:^{
    weakSelf.isAnnounceLocked = NO;
    [weakSelf _scheduleAnnounce];
  }];
}

#pragma mark - Announce

- (void)announce:(NSString *)announcement {
  [self announce:announcement onFired:nil];
}

- (void)announce:(NSString *)announcement onFired:(nullable dispatch_block_t)onFired {
  [self.announceQueue add:announcement];
  if (onFired) [self.onFiredCallbacks addObject:onFired];
  [self _scheduleAnnounce];
}

- (void)cancelAll {
  [self.announceQueue clear];
  [self.onFiredCallbacks removeAllObjects];
}

#pragma mark - Private

- (void)_scheduleAnnounce {
  if (!self.canAnnounce) return;
  __weak RCA11yAnnounceService *weakSelf = self;
  [self.announceDebouncer debounceAction:^{ [weakSelf _announceNow]; }];
}

- (void)_announceNow {
  if (!self.canAnnounce) return;
  [RCA11yAnnounceHelper announceWithList:self.announceQueue.list];
  [self.announceQueue clear];
  for (dispatch_block_t cb in self.onFiredCallbacks.copy) { cb(); }
  [self.onFiredCallbacks removeAllObjects];
}

@end
