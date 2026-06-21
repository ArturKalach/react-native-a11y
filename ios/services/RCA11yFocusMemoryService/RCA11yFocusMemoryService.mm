//
//  RCA11yFocusMemoryService.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yFocusMemoryService.h"
#import "RCA11yKeyboardFocusService.h"

@implementation RCA11yFocusMemoryService {
  __weak UIView *_storedView;
}

- (void)store:(id<UIFocusEnvironment>)environment {
  if (!environment) {
    return;
  }

  _storedView = [RCA11yKeyboardFocusService getFocusedItem:environment];
  [RCA11yKeyboardFocusService updatePreferredFocusEnvironment:_storedView];
}

- (void)restore {
  if (!_storedView) {
    return;
  }

  [RCA11yKeyboardFocusService focus:_storedView];
  _storedView = nil;
}

- (UIView *)get {
  return _storedView;
}

- (void)clean {
  _storedView = nil;
}

@end
