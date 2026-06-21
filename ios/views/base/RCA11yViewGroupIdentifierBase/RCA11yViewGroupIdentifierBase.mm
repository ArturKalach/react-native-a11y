//
//  RCA11yViewGroupIdentifierBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yViewGroupIdentifierBase.h"
#import "RCA11yGroupIdentifierDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RCA11yNativeProps.h"
#import "RCA11yPropsHelper.h"
#endif

@implementation RCA11yViewGroupIdentifierBase {
  RCA11yGroupIdentifierDelegate *_gIdDelegate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _gIdDelegate = [[RCA11yGroupIdentifierDelegate alloc] initWithView: self];
  }

  return self;
}

- (NSString *)focusGroupIdentifier {
  if(self.canBecomeFocused) {
    return [self customGroupIdentifier];
  }

  return [super focusGroupIdentifier];
}

- (NSString*)customGroupIdentifier {
  return _gIdDelegate.focusGroupIdentifier;
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateGroupIdentifierProps:(const RCA11y::GroupIdentifierProps &)oldProps
                          newProps:(const RCA11y::GroupIdentifierProps &)newProps {
  if (newProps.groupIdentifier.empty() && self.customGroupId != nil) {
    self.customGroupId = nil;
  }


  NSString* newGroupId = [RCA11yPropsHelper unwrapStringValue: newProps.groupIdentifier];

  if(![_customGroupId isEqual: newGroupId]) {
    [self setCustomGroupId: newGroupId];
  }
}
#endif

- (void) setCustomGroupId:(NSString *)customGroupId {
  _customGroupId = customGroupId;
}

- (void)cleanReferences {
  [super cleanReferences];
  _customGroupId = nil;
}


@end
