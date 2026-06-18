//
//  RCA11yOrderSubscriber.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yOrderSubscriber.h"

@implementation RCA11yOrderSubscriber

- (instancetype)initWithId:(NSString*)identifier updatedCallback:(LinkUpdatedCallback)onLinkUpdated
                        removedCallback:(LinkRemovedCallback)onLinkRemoved {
  self = [super init];
  if (self) {
    _identifier = identifier;
    _onLinkUpdated = onLinkUpdated;
    _onLinkRemoved = onLinkRemoved;
  }
  return self;
}

@end
