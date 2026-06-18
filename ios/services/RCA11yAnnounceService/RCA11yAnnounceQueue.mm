//
//  RCA11yAnnounceQueue.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yAnnounceQueue.h"

@interface RCA11yAnnounceQueue ()
@property (nonatomic, strong) NSMutableArray<NSString *> *announceArray;
@end

@implementation RCA11yAnnounceQueue


- (BOOL)isEmpty {
  return _announceArray.count == 0;
}

- (NSArray<NSString *> *)list {
  return [_announceArray copy];
}

- (instancetype)init {
  if (self = [super init]) {
    _announceArray = [[NSMutableArray alloc] init];
  }
  return self;
}

- (void)add:(NSString *)message {
  if (message.length != 0) {
    [_announceArray addObject: message];
  }
}

- (void)clear {
  [_announceArray removeAllObjects];
}

@end
