//
//  RCA11yGroupIdentifierDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yGroupIdentifierDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTViewComponentView+RCA11y.h"
#endif


@implementation RCA11yGroupIdentifierDelegate {
  UIView<RCA11yGroupIdentifierProtocol>* _delegate;
  NSString* _tagId;
}

- (instancetype _Nonnull )initWithView:(UIView<RCA11yGroupIdentifierProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
}


- (NSString *)tagId {
  if (!_tagId) {
    _tagId = [NSString stringWithFormat:@"app.group.%@", [NSUUID UUID].UUIDString];
  }
  return _tagId;
}

- (NSString *)focusGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    return _delegate.customGroupId ?: self.tagId;
  }
  return self.tagId;
}

@end
