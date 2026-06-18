//
//  RCA11yDebouncer.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yDebouncer.h"

@implementation RCA11yDebouncer

- (instancetype)initWithInterval:(NSTimeInterval)interval {
  self = [super init];
  if (self) {
    _debounceInterval = interval;
    _queue = dispatch_get_main_queue();
    _debounceBlock = nil;
  }
  return self;
}

- (void)debounceAction:(void (^)(void))action {
  self.debounceBlock = nil;

  __weak __typeof(self) weakSelf = self;
  self.debounceBlock = ^{
    if(action) {
      action();
    }
  };


  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(_debounceInterval * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
    if (weakSelf.debounceBlock) {
      weakSelf.debounceBlock();
      weakSelf.debounceBlock = nil;
    }
  });
}

@end
